from fastapi import FastAPI, Depends,
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uvicorn
import os
from dotenv import load_dotenv
from api import recording, transcription, booking, whatsapp, reminders, calendar_service, automation_hub
from api import recording, transcription, booking, whatsapp, reminders, calendar_service, automation_hub, customer_onboarding
from api import (
        recording, transcription, booking, whatsapp, reminders, 
            calendar_service, automation_hub, customer_onboarding, strategy_planning
            )
)
# === ADD THIS BELOW YOUR EXISTING IMPORTS ===

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# In backend/app.py — add near top
from typing import List
from pydantic import BaseModel



# === REPLACE YOUR OLD team_db WITH THIS ===

team_db = [
    {
        "id": "1",
        "name": "Sarah Johnson",
        "email": "sarah.j@company.com",
        "avatar": "https://randomuser.me/api/portraits/women/44.jpg",
        "role": "Admin",
        "status": "Active",
        "department": "Marketing",
        "permissions": ["view_clients", "edit_team", "send_sms", "export_data", "view_finances"],
        "delegates": ["2", "3"],  # Can act as Michael & Emily
        "can_delegate_to": []     # No one acts for her
    },
    {
        "id": "2",
        "name": "Michael Chen",
        "email": "michael.c@company.com",
        "avatar": "https://randomuser.me/api/portraits/men/32.jpg",
        "role": "Manager",
        "status": "Active",
        "department": "Developer",
        "permissions": ["view_clients", "edit_bookings", "send_sms"],
        "delegates": ["4"],       # Can act as James
        "can_delegate_to": ["1"]  # Sarah can act for him
    },
    {
        "id": "3",
        "name": "Emily Davis",
        "email": "emily.d@company.com",
        "avatar": "https://randomuser.me/api/portraits/women/65.jpg",
        "role": "Agent",
        "status": "Inactive",
        "department": "Marketing",
        "permissions": ["view_clients", "send_sms"],
        "delegates": [],
        "can_delegate_to": ["1"]
    },
    {
        "id": "4",
        "name": "James Wilson",
        "email": "james.w@company.com",
        "avatar": "https://randomuser.me/api/portraits/men/45.jpg",
        "role": "Agent",
        "status": "Active",
        "department": "Developer",
        "permissions": ["view_clients"],
        "delegates": [],
        "can_delegate_to": ["2"]
    }
]
class TeamMember(BaseModel):
    id: str
    name: str
    email: str
    avatar: str
    role: str
    status: str
    department: str
    permissions: List[str]
    delegates: List[str]
    can_delegate_to: List[str]
# Mock Client Data (Replace with DB later)
clients_db = {
    "1": {
            "id": "1",
                    "name": "Jonathan Doe",
                            "title": "CEO, Acme Corp",
                                    "avatar": "https://randomuser.me/api/portraits/men/32.jpg",
                                            "totalRevenue": 42500,
                                                    "repeatRate": 85,
                                                            "leadSource": "LinkedIn Referral",
                                                                    "accountManager": "Sarah Miller",
                                                                            "lastContacted": "2023-10-24T10:00:00Z",
                                                                                    "pendingTasks": [
                                                                                                {
                                                                                                                "title": "Q4 Review Meeting",
                                                                                                                                "dueDate": "Tomorrow",
                                                                                                                                                "assignee": "Sarah M.",
                                                                                                                                                                "priority": "Urgent"
                                                                                                                                                                            },
                                                                                                                                                                                        {
                                                                                                                                                                                                        "title": "Contract Renewal Draft",
                                                                                                                                                                                                                        "dueDate": "Friday",
                                                                                                                                                                                                                                        "assignee": "David L.",
                                                                                                                                                                                                                                                        "priority": "Pending"
                                                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                                                            ],
                                                                                                                                                                                                                                                                                    "npsScore": 8.5,
                                                                                                                                                                                                                                                                                            "paymentHistory": [
                                                                                                                                                                                                                                                                                                        {"invoiceNumber": "#8421", "date": "2023-10-12", "amount": 2400, "status": "PAID"},
                                                                                                                                                                                                                                                                                                                    {"invoiceNumber": "#8392", "date": "2023-09-15", "amount": 4150, "status": "PAID"},
                                                                                                                                                                                                                                                                                                                                {"invoiceNumber": "#8355", "date": "2023-08-20", "amount": 1800, "status": "PENDING"}
                                                                                                                                                                                                                                                                                                                                        ],
                                                                                                                                                                                                                                                                                                                                                "recentOutreach": [
                                                                                                                                                                                                                                                                                                                                                            {"type": "email", "title": "Follow-up Email Sent", "date": "Oct 24, 2:30 PM", "meta": "Open Rate: 100%"},
                                                                                                                                                                                                                                                                                                                                                                        {"type": "sms", "title": "SMS Confirmation", "date": "Oct 20, 11:15 AM", "meta": "Delivered"},
                                                                                                                                                                                                                                                                                                                                                                                    {"type": "call", "title": "Introductory Call", "date": "Oct 18, 4:00 PM", "meta": "Duration: 15m"}
                                                                                                                                                                                                                                                                                                                                                                                            ],
                                                                                                                                                                                                                                                                                                                                                                                                    "totalBookings": 24,
                                                                                                                                                                                                                                                                                                                                                                                                            "nextBooking": "2023-11-12T09:00:00Z"
                                                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                                                                }

                                                                                                                                                                                                                                                                                                                                                                                                                # Pydantic Model for Response
                                                                                                                                                                                                                                                                                                                                                                                                                class Client(BaseModel):
                                                                                                                                                                                                                                                                                                                                                                                                                    id: str
                                                                                                                                                                                                                                                                                                                                                                                                                        name: str
                                                                                                                                                                                                                                                                                                                                                                                                                            title: str
                                                                                                                                                                                                                                                                                                                                                                                                                                avatar: str
                                                                                                                                                                                                                                                                                                                                                                                                                                    totalRevenue: float
                                                                                                                                                                                                                                                                                                                                                                                                                                        repeatRate: int
                                                                                                                                                                                                                                                                                                                                                                                                                                            leadSource: str
                                                                                                                                                                                                                                                                                                                                                                                                                                                accountManager: str
                                                                                                                                                                                                                                                                                                                                                                                                                                                    lastContacted: str
                                                                                                                                                                                                                                                                                                                                                                                                                                                        pendingTasks: List[dict]
                                                                                                                                                                                                                                                                                                                                                                                                                                                            npsScore: float
                                                                                                                                                                                                                                                                                                                                                                                                                                                                paymentHistory: List[dict]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                    recentOutreach: List[dict]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                        totalBookings: int
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            nextBooking: str

                                                                                                                                                                                                                                                                                                                                                                                                                                                                            # === END OF NEW CODE ===



# Import database
from models.database import init_db, get_db

# Import API routes
from api import recording, transcription, booking, whatsapp, reminders

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Call Automation Hub",
        description="Automated call recording, AI transcription, booking detection, and customer communication",
            version="1.0.0"
            )

            # Configure CORS
            app.add_middleware(
                CORSMiddleware,
                    allow_origins=["http://localhost:3000", "http://localhost:5173"],
                        allow_credentials=True,
                            allow_methods=["*"],
                                allow_headers=["*"],
                                )

                                # Initialize database on startup
                                @app.on_event("startup")
                                async def startup_event():
                                    print("🚀 Starting Call Automation Hub...")
                                        init_db()
                                            print("✅ Database initialized!")
                                                
                                                    # Create recordings folder
                                                        audio_path = os.getenv("AUDIO_STORAGE_PATH", "./recordings")
                                                            os.makedirs(audio_path, exist_ok=True)
                                                                print(f"✅ Audio storage ready at: {audio_path}")

                                                                # Root endpoint
                                                                @app.get("/")
                                                                async def root():
                                                                    return {
                                                                            "message": "Call Automation Hub API",
                                                                                    "status": "active",
                                                                                            "version": "1.0.0"
                                                                                                }

                                                                                                # Health check
                                                                                                @app.get("/api/health")
                                                                                                async def health_check(db: Session = Depends(get_db)):
                                                                                                    try:
                                                                                                            db.execute("SELECT 1")
                                                                                                                    return {
                                                                                                                                "status": "healthy",
                                                                                                                                            "database": "connected",
                                                                                                                                                        "services": {
                                                                                                                                                                        "twilio": "configured",
                                                                                                                                                                                        "openai": "configured",
                                                                                                                                                                                                        "google_calendar": "configured",
                                                                                                                                                                                                                        "whatsapp": "configured"
                                                                                                                                                                                                                                    }
                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                except Exception as e:
                                                                                                                                                                                                                                                        return {
                                                                                                                                                                                                                                                                    "status": "unhealthy",
                                                                                                                                                                                                                                                                                "error": str(e)
                                                                                                                                                                                                                                                                                        }

                                                                                                                                                                                                                                                                                        # Include API routers
                                                                                                                                                                                                                                                                                        app.include_router(recording.router, prefix="/api/recording", tags=["Recording"])
                                                                                                                                                                                                                                                                                        app.include_router(transcription.router, prefix="/api/transcription", tags=["Transcription"])
                                                                                                                                                                                                                                                                                        app.include_router(booking.router, prefix="/api/bookings", tags=["Bookings"])
                                                                                                                                                                                                                                                                                        app.include_router(whatsapp.router, prefix="/api/whatsapp", tags=["WhatsApp"])
                                                                                                                                                                                                                                                                                        app.include_router(reminders.router, prefix="/api/reminders", tags=["Reminders"])
                                                                                                                                                                                                                                                                                        app.include_router(automation_hub.router, prefix="/api/automation-hub", tags=["Automation Hub"])
                                                                                                                                                                                                                                                                                        app.include_router(customer_onboarding.router, prefix="/api/customer-onboarding", tags=["Customer Onboarding"])
                                                                                                                                                                                                                                                                                        app.include_router(strategy_planning.router, prefix="/api/strategy-planning", tags=["Strategy & Planning"])
# === ADD THIS AFTER YOUR EXISTING FASTAPI ROUTES ===

@app.get("/api/client/{client_id}", response_model=Client)
async def get_client(client_id: str):
    client = clients_db.get(client_id)
        if not client:
                raise HTTPException(status_code=404, detail="Client not found")
                    return client

                    # === END OF NEW ROUTE ===
                                                                                                                                                                                                                                                                                        # Run the application
                                                                                                                                                                                                                                                                                        if __name__ == "__main__":
                                                                                                                                                                                                                                                                                            port = int(os.getenv("PORT", 8000))
                                                                                                                                                                                                                                                                                                uvicorn.run(
                                                                                                                                                                                                                                                                                                        "app:app",
                                                                                                                                                                                                                                                                                                                host="0.0.0.0",
                                                                                                                                                                                                                                                                                                                        port=port,
                                                                                                                                                                                                                                                                                                                                reload=True
                                                                                                                                                                                                                                                                                                                                    )
