from datetime import datetime, timezone
from pathlib import Path
import sqlite3

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "autops.db"

app = FastAPI(title="Business Dashboard API", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ProfileUpdate(BaseModel):
    name: str
    email: str
    role: str


class SettingsUpdate(BaseModel):
    notifications: bool
    dark_mode: bool


class ClinicIntakeRequest(BaseModel):
    whatsapp_message: str
    age: int
    medical_history: str = ""
    preferred_date: str = "Tomorrow"


class FigmaConnectRequest(BaseModel):
    account_email: str
    team_name: str = ""


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _detect_intent(message: str) -> str:
    text = message.lower()
    if any(word in text for word in ["book", "appointment", "doctor", "visit"]):
        return "book_doctor"
    if any(word in text for word in ["question", "cost", "timing", "open"]):
        return "faq"
    if any(word in text for word in ["follow", "check", "report", "result"]):
        return "follow_up"
    return "symptom_check"


def _extract_symptoms(message: str) -> list[str]:
    dictionary = [
        "fever",
        "cough",
        "cold",
        "chest pain",
        "breathing trouble",
        "vomiting",
        "diarrhea",
        "headache",
        "dizziness",
        "rash",
    ]
    text = message.lower()
    matches = [symptom for symptom in dictionary if symptom in text]
    return matches or ["general discomfort"]


def _risk_score(age: int, medical_history: str, symptoms: list[str]) -> tuple[int, str]:
    score = min(100, age // 2)
    history = medical_history.lower()

    if any(term in history for term in ["diabetes", "asthma", "heart", "hypertension"]):
        score += 20

    if any(s in symptoms for s in ["chest pain", "breathing trouble", "dizziness"]):
        score += 25
    elif len(symptoms) >= 3:
        score += 15
    else:
        score += 8

    score = min(100, score)
    if score >= 70:
        level = "high"
    elif score >= 40:
        level = "medium"
    else:
        level = "low"
    return score, level


def get_db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS profile (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            role TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
        """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            notifications INTEGER NOT NULL,
            dark_mode INTEGER NOT NULL,
            updated_at TEXT NOT NULL
        )
        """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS templates (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            description TEXT NOT NULL,
            icon TEXT NOT NULL,
            color TEXT NOT NULL
        )
        """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS workflows (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            trigger_text TEXT NOT NULL,
            is_active INTEGER NOT NULL
        )
        """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS activity (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS app_connections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            app_name TEXT NOT NULL UNIQUE,
            account_email TEXT NOT NULL,
            team_name TEXT NOT NULL,
            connected_at TEXT NOT NULL
        )
        """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS clinic_bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_message TEXT NOT NULL,
            age INTEGER NOT NULL,
            medical_history TEXT NOT NULL,
            symptoms TEXT NOT NULL,
            risk_score INTEGER NOT NULL,
            risk_level TEXT NOT NULL,
            doctor_name TEXT NOT NULL,
            appointment_date TEXT NOT NULL,
            reminder_text TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )

    cur.execute("SELECT COUNT(*) AS count FROM profile")
    if cur.fetchone()["count"] == 0:
        cur.execute(
            "INSERT INTO profile (id, name, email, role, updated_at) VALUES (1, ?, ?, ?, ?)",
            ("Darmiyaan", "admin@company.com", "Admin", _utc_now()),
        )

    cur.execute("SELECT COUNT(*) AS count FROM settings")
    if cur.fetchone()["count"] == 0:
        cur.execute(
            "INSERT INTO settings (id, notifications, dark_mode, updated_at) VALUES (1, 1, 0, ?)",
            (_utc_now(),),
        )

    cur.execute("SELECT COUNT(*) AS count FROM templates")
    if cur.fetchone()["count"] == 0:
        cur.executemany(
            "INSERT INTO templates (id, title, category, description, icon, color) VALUES (?, ?, ?, ?, ?, ?)",
            [
                (1, "Customer Onboarding", "Salon & Beauty", "Automate client intake and setup tasks", "📅", "#FFB6C1"),
                (2, "Inventory Alert", "Retail", "Notify low-stock products automatically", "📦", "#60A5FA"),
            ],
        )

    cur.execute("SELECT COUNT(*) AS count FROM workflows")
    if cur.fetchone()["count"] == 0:
        cur.executemany(
            "INSERT INTO workflows (id, name, trigger_text, is_active) VALUES (?, ?, ?, ?)",
            [
                (1, "Booking Reminder", "24h before appointment", 1),
                (2, "Missed Call Follow-up", "5m after missed call", 1),
            ],
        )

    cur.execute("SELECT COUNT(*) AS count FROM activity")
    if cur.fetchone()["count"] == 0:
        cur.execute(
            "INSERT INTO activity (text, created_at) VALUES (?, ?)",
            ("Database initialized", _utc_now()),
        )

    conn.commit()
    conn.close()


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/")
def read_root():
    return {"message": "Business Dashboard API", "status": "operational"}


@app.get("/api/health")
def health_check():
    conn = get_db()
    conn.execute("SELECT 1")
    conn.close()
    return {"status": "healthy", "database": "connected", "timestamp": _utc_now()}


@app.get("/api/profile")
def get_profile():
    conn = get_db()
    row = conn.execute("SELECT name, email, role, updated_at FROM profile WHERE id = 1").fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Profile not found")
    return dict(row)


@app.put("/api/profile")
def update_profile(payload: ProfileUpdate):
    conn = get_db()
    conn.execute(
        "UPDATE profile SET name = ?, email = ?, role = ?, updated_at = ? WHERE id = 1",
        (payload.name, payload.email, payload.role, _utc_now()),
    )
    conn.commit()
    conn.close()
    return {"success": True}


@app.get("/api/settings")
def get_settings():
    conn = get_db()
    row = conn.execute("SELECT notifications, dark_mode, updated_at FROM settings WHERE id = 1").fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="Settings not found")
    return {
        "notifications": bool(row["notifications"]),
        "dark_mode": bool(row["dark_mode"]),
        "updated_at": row["updated_at"],
    }


@app.put("/api/settings")
def update_settings(payload: SettingsUpdate):
    conn = get_db()
    conn.execute(
        "UPDATE settings SET notifications = ?, dark_mode = ?, updated_at = ? WHERE id = 1",
        (int(payload.notifications), int(payload.dark_mode), _utc_now()),
    )
    conn.commit()
    conn.close()
    return {"success": True}


@app.get("/api/integrations/figma")
def figma_connection_status():
    conn = get_db()
    row = conn.execute(
        "SELECT app_name, account_email, team_name, connected_at FROM app_connections WHERE app_name = 'figma'"
    ).fetchone()
    conn.close()
    if not row:
        return {"connected": False}
    return {
        "connected": True,
        "app_name": row["app_name"],
        "account_email": row["account_email"],
        "team_name": row["team_name"],
        "connected_at": row["connected_at"],
    }


@app.post("/api/integrations/figma/connect")
def connect_figma(payload: FigmaConnectRequest):
    conn = get_db()
    conn.execute(
        """
        INSERT INTO app_connections (app_name, account_email, team_name, connected_at)
        VALUES ('figma', ?, ?, ?)
        ON CONFLICT(app_name) DO UPDATE SET
            account_email = excluded.account_email,
            team_name = excluded.team_name,
            connected_at = excluded.connected_at
        """,
        (payload.account_email, payload.team_name, _utc_now()),
    )
    conn.execute(
        "INSERT INTO activity (text, created_at) VALUES (?, ?)",
        (f"Figma connected for {payload.account_email}", _utc_now()),
    )
    conn.commit()
    conn.close()
    return {"connected": True, "app_name": "figma", "account_email": payload.account_email, "team_name": payload.team_name}


@app.get("/api/operations")
def get_operations():
    conn = get_db()
    total_workflows = conn.execute("SELECT COUNT(*) AS c FROM workflows").fetchone()["c"]
    active_workflows = conn.execute("SELECT COUNT(*) AS c FROM workflows WHERE is_active = 1").fetchone()["c"]
    conn.close()
    return {
        "total_projects": total_workflows,
        "on_track": active_workflows,
        "at_risk": max(total_workflows - active_workflows, 0),
        "delayed": 0,
        "projects_today": [],
        "projects_upcoming": [],
        "projects_completed": [],
    }


@app.get("/api/templates")
def get_templates():
    conn = get_db()
    rows = conn.execute("SELECT id, title, category, description, icon, color FROM templates ORDER BY id").fetchall()
    conn.close()
    categories = sorted({row["category"] for row in rows})
    return {"categories": ["All", *categories], "templates": [dict(row) for row in rows]}


@app.get("/api/automation-hub/ai-suggestions")
def ai_suggestions():
    return {
        "suggestions": [
            {"id": 1, "title": "Auto-send follow up after missed calls", "impact": "High", "effort": "Low"},
            {"id": 2, "title": "Use WhatsApp reminder fallback", "impact": "Medium", "effort": "Low"},
        ]
    }


@app.get("/api/automation-hub/workflows")
def workflows():
    conn = get_db()
    rows = conn.execute("SELECT id, name, trigger_text, is_active FROM workflows ORDER BY id").fetchall()
    conn.close()
    return {
        "workflows": [
            {"id": row["id"], "name": row["name"], "trigger": row["trigger_text"], "is_active": bool(row["is_active"])}
            for row in rows
        ]
    }


@app.patch("/api/automation-hub/workflows/{workflow_id}")
def update_workflow(workflow_id: int, payload: dict):
    is_active = payload.get("is_active")
    if is_active is None:
        raise HTTPException(status_code=400, detail="is_active is required")

    conn = get_db()
    cursor = conn.execute("UPDATE workflows SET is_active = ? WHERE id = ?", (int(bool(is_active)), workflow_id))
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Workflow not found")

    conn.execute(
        "INSERT INTO activity (text, created_at) VALUES (?, ?)",
        (f"Workflow {workflow_id} set to {'active' if is_active else 'inactive'}", _utc_now()),
    )
    conn.commit()
    conn.close()
    return {"workflow_id": workflow_id, "updated": {"is_active": bool(is_active)}}


@app.get("/api/automation-hub/activity")
def activity():
    conn = get_db()
    rows = conn.execute("SELECT id, text, created_at FROM activity ORDER BY id DESC LIMIT 20").fetchall()
    conn.close()
    return {"activities": [{"id": r["id"], "text": r["text"], "timestamp": r["created_at"]} for r in rows]}


@app.post("/api/automation-hub/ai-suggestions/{suggestion_id}/implement")
def implement_suggestion(suggestion_id: int):
    conn = get_db()
    conn.execute("INSERT INTO activity (text, created_at) VALUES (?, ?)", (f"Suggestion {suggestion_id} implemented", _utc_now()))
    conn.commit()
    conn.close()
    return {"implemented": True, "suggestion_id": suggestion_id}


@app.post("/api/clinic-intake/triage")
def clinic_intake_triage(payload: ClinicIntakeRequest):
    intent = _detect_intent(payload.whatsapp_message)
    symptoms = _extract_symptoms(payload.whatsapp_message)
    score, risk_level = _risk_score(payload.age, payload.medical_history, symptoms)

    doctor = "General Physician"
    if any(s in symptoms for s in ["chest pain", "breathing trouble"]):
        doctor = "Emergency Physician"
    elif "rash" in symptoms:
        doctor = "Dermatologist"

    reminder = f"Reminder: Your appointment with {doctor} is on {payload.preferred_date}."

    conn = get_db()
    cursor = conn.execute(
        """
        INSERT INTO clinic_bookings (
            patient_message, age, medical_history, symptoms, risk_score, risk_level,
            doctor_name, appointment_date, reminder_text, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            payload.whatsapp_message,
            payload.age,
            payload.medical_history,
            ", ".join(symptoms),
            score,
            risk_level,
            doctor,
            payload.preferred_date,
            reminder,
            _utc_now(),
        ),
    )
    booking_id = cursor.lastrowid
    conn.execute(
        "INSERT INTO activity (text, created_at) VALUES (?, ?)",
        (f"Clinic intake booking created #{booking_id} ({risk_level} risk)", _utc_now()),
    )
    conn.commit()
    conn.close()

    return {
        "workflow": [
            "WhatsApp msg",
            "intent detect",
            "ask symptoms",
            "collect age/history",
            "risk score",
            "book doctor",
            "send reminders",
        ],
        "intent": intent,
        "symptoms": symptoms,
        "age": payload.age,
        "medical_history": payload.medical_history,
        "risk_score": score,
        "risk_level": risk_level,
        "doctor_booking": {
            "booking_id": booking_id,
            "doctor_name": doctor,
            "appointment_date": payload.preferred_date,
        },
        "reminder": reminder,
    }
