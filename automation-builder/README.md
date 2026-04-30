# NLP Automation Builder (Production Scaffold)

## Stack
- FastAPI + WebSocket, SQLAlchemy, Alembic-compatible models
- PostgreSQL + Redis + Celery
- Fine-tuned SLM pipeline (T5-small) with rules fallback
- React + TypeScript + React Query + Zustand + React Flow

## Workflow Definition Schema
```json
{
  "nodes": [
    {"id": "trigger_1", "type": "trigger", "app": "gmail", "action": "new_email", "parameters": {}},
    {"id": "action_1", "type": "action", "app": "google_sheets", "action": "append_row", "parameters": {}},
    {"id": "agent_1", "type": "agent", "app": "llm_agent", "action": "infer", "parameters": {"prompt": "..."}}
  ],
  "edges": [{"source": "trigger_1", "target": "action_1"}]
}
```

## Run with Docker Compose
```bash
cd automation-builder
docker compose up --build
```
- Frontend: http://localhost:5173
- Backend: http://localhost:8000/docs

## Fine-tune model
```bash
cd backend
python -m pip install -r requirements.txt
python training/fine_tune.py
```
Dataset format is in `training/data.jsonl` as `{"input": ..., "output": ...}` JSONL records.

## Core endpoints
- `POST /api/chat/parse`
- `POST /api/workflows/from-session/{session_id}`
- `WS /api/ws/chat`
