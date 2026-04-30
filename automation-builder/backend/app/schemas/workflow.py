from pydantic import BaseModel, Field


class WorkflowNode(BaseModel):
    id: str
    type: str = Field(description="trigger|action|condition|agent")
    app: str
    action: str
    parameters: dict = Field(default_factory=dict)


class WorkflowEdge(BaseModel):
    source: str
    target: str


class WorkflowDefinition(BaseModel):
    nodes: list[WorkflowNode]
    edges: list[WorkflowEdge]


class ChatRequest(BaseModel):
    session_id: int | None = None
    message: str


class ChatResponse(BaseModel):
    session_id: int
    reply: str
    missing_slots: list[str]
    workflow_preview: WorkflowDefinition | None = None
