from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="autops-mvp backend")

# Allow the dev frontend to call the API (vite default port 5173) — in dev allow localhost origins
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # permissive for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Item(BaseModel):
    id: int
    name: str | None = None
    description: str | None = None


@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>autops-mvp Backend</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 600px; }
            h1 { color: #333; }
            .status { background: #e8f5e9; padding: 10px; border-radius: 4px; margin: 10px 0; }
            .endpoints { background: #f0f7ff; padding: 10px; border-radius: 4px; margin: 10px 0; font-family: monospace; }
            a { color: #0066cc; text-decoration: none; }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>✅ autops-mvp Backend</h1>
            <div class="status">
                <strong>Status:</strong> Running on http://0.0.0.0:8000
            </div>
            <h2>API Endpoints</h2>
            <div class="endpoints">
                <p>GET <a href="/health">/health</a> — Health check</p>
                <p>GET <a href="/docs">/docs</a> — Swagger API docs</p>
            </div>
        </div>
    </body>
    </html>
    """


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    """Sample PUT endpoint to update an item.

    Returns the received payload merged with the path id so you can test PUT requests from the browser.
    """
    # Ensure path id matches payload id (if provided)
    if item.id != item_id:
        return {"error": "Path id and payload id mismatch", "path_id": item_id, "payload_id": item.id}

    # In a real app you'd persist updates — here just echo back
    return {"status": "updated", "item": item.dict()}
