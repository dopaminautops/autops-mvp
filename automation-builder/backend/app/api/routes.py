from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.entities import ChatMessage, ChatSession, Workflow, WorkflowTemplate
from app.schemas.workflow import ChatRequest, ChatResponse, WorkflowDefinition
from app.services.dialogue_manager import missing_slots
from app.services.nlp_engine import engine
from app.services.template_search import searcher

router = APIRouter()


def _to_definition(parsed: dict) -> dict:
    trigger = parsed.get("trigger", {"app": "manual", "event": "run"})
    actions = parsed.get("actions", [])
    nodes = [{"id": "trigger_1", "type": "trigger", "app": trigger.get("app", "manual"), "action": trigger.get("event", "run"), "parameters": trigger.get("parameters", {})}]
    edges = []
    prev = "trigger_1"
    for i, action in enumerate(actions, start=1):
        nid = f"action_{i}"
        nodes.append({"id": nid, "type": "agent" if action.get("app") == "llm_agent" else "action", "app": action.get("app", "unknown"), "action": action.get("action", "run"), "parameters": action.get("parameters", {})})
        edges.append({"source": prev, "target": nid})
        prev = nid
    return {"nodes": nodes, "edges": edges}


@router.post("/chat/parse", response_model=ChatResponse)
def parse_chat(request: ChatRequest, db: Session = Depends(get_db)):
    parsed = engine.parse(request.message)
    templates = [
        {"id": t.id, "name": t.name, "description": t.description, "definition": t.definition}
        for t in db.query(WorkflowTemplate).all()
    ]
    best_template, score = searcher.best_match(request.message, templates)

    workflow = parsed.workflow
    reply = "I drafted a workflow from your request."
    if best_template and score > 0.75:
        workflow = best_template["definition"]
        reply = f"I found template '{best_template['name']}'. Use this template?"

    session = db.query(ChatSession).filter(ChatSession.id == request.session_id).first() if request.session_id else None
    if not session:
        session = ChatSession(user_id=1, state={})
        db.add(session)
        db.flush()

    session.state = {"workflow": workflow}
    db.add(ChatMessage(session_id=session.id, role="user", content=request.message))
    db.add(ChatMessage(session_id=session.id, role="assistant", content=reply))
    db.commit()

    missing = missing_slots(workflow)
    return ChatResponse(
        session_id=session.id,
        reply=reply if not missing else f"{reply} I still need: {', '.join(missing)}",
        missing_slots=missing,
        workflow_preview=WorkflowDefinition(**_to_definition(workflow)),
    )


@router.post("/workflows/from-session/{session_id}")
def save_workflow(session_id: int, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    workflow = Workflow(
        user_id=1,
        name="Generated Automation",
        description="Created from chat",
        status="inactive",
        definition=_to_definition(session.state.get("workflow", {})),
    )
    db.add(workflow)
    db.commit()
    return {"workflow_id": workflow.id, "status": "saved"}


@router.websocket("/ws/chat")
async def chat_ws(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_json({"role": "assistant", "content": "Describe your automation idea to begin."})
    try:
        while True:
            payload = await websocket.receive_json()
            text = payload.get("message", "")
            parsed = engine.parse(text)
            await websocket.send_json({"role": "assistant", "content": "Parsed your workflow request.", "workflow": _to_definition(parsed.workflow)})
    except WebSocketDisconnect:
        return
