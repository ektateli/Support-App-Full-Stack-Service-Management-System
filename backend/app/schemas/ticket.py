from pydantic import BaseModel
from app.models.ticket import TicketStatus
from enum import Enum



class TicketPriority(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class TicketCreate(BaseModel):
    # customer_id: int
    project_id: int
    site_id: int
    equipment: str
    issue: str
    priority: TicketPriority = TicketPriority.MEDIUM

class TicketAssign(BaseModel):
    engineer_id: int

class TicketStatusUpdate(BaseModel):
    status: TicketStatus
    comment: str | None = None

class TicketOut(BaseModel):
    id: int
    customer_id: int
    project_id: int
    site_id: int
    equipment: str
    issue: str
    status: TicketStatus
    assigned_to: int | None

    class Config:
        from_attributes = True
