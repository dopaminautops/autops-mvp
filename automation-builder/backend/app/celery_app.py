from celery import Celery
from app.core.config import settings

celery_app = Celery("automation_builder", broker=settings.redis_url, backend=settings.redis_url)


@celery_app.task
def run_workflow(workflow_id: int):
    return {"workflow_id": workflow_id, "status": "queued"}
