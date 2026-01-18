# backend/model/team.py

from pydantic import BaseModel
from typing import List, Optional

class TeamMember(BaseModel):
    id: str
    name: str
    email: str
    avatar: Optional[str] = None
    role: str  # e.g., "admin", "manager", "agent"
    status: str  # "Active" / "Inactive"
    department: str
    permissions: List[str]  # e.g., ["view_clients", "edit_bookings", "export_data"]
    delegates: List[str]  # list of member IDs this user can act for
    can_delegate_to: List[str]  # list of member IDs who can act for this user