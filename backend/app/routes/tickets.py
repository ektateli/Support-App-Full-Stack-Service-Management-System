from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.ticket import Ticket, TicketStatus
from app.models.ticket_log import TicketLog
from app.schemas.ticket import TicketCreate, TicketAssign, TicketStatusUpdate, TicketOut
from app.models.user import RoleEnum
from app.core.rbac import require_roles, get_current_user

router = APIRouter(prefix="/tickets", tags=["Tickets"])

def log(db, ticket_id, action, message, user_id):
    db.add(TicketLog(
        ticket_id=ticket_id,
        action=action,
        message=message,
        user_id=user_id
    ))
    db.commit()

@router.post("/", response_model=TicketOut)
def create_ticket(
    data: TicketCreate,
    db: Session = Depends(get_db),
    user=Depends(require_roles(RoleEnum.CUSTOMER))
):
    if not user.customer_id:
        raise HTTPException(
            status_code=400,
            detail="Customer profile not linked. Contact admin."
        )

    ticket = Ticket(
        customer_id=user.customer_id,
        project_id=data.project_id,
        site_id=data.site_id,
        equipment=data.equipment,
        issue=data.issue,
        created_by=user.id
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    log(db, ticket.id, "CREATED", "Ticket created", user.id)
    return ticket



# Customer: apne tickets dekhe
@router.get("/my")
def my_tickets(
    db: Session = Depends(get_db),
    user=Depends(require_roles(RoleEnum.CUSTOMER))
):
    return db.query(Ticket).filter(Ticket.created_by == user.id).all()


# Customer Dashboard Stats
@router.get("/my/stats")
def my_ticket_stats(
    db: Session = Depends(get_db),
    user=Depends(require_roles(RoleEnum.CUSTOMER))
):
    tickets = db.query(Ticket).filter(Ticket.created_by == user.id).all()

    total = len(tickets)
    open_ = len([t for t in tickets if t.status == TicketStatus.OPEN])
    in_prog = len([t for t in tickets if t.status == TicketStatus.IN_PROGRESS])
    resolved = len([t for t in tickets if t.status == TicketStatus.RESOLVED])

    return {
        "total": total,
        "open": open_,
        "in_progress": in_prog,
        "resolved": resolved,
    }


# Admin assigns engineer
@router.post("/{ticket_id}/assign")
def assign_ticket(
    ticket_id: int,
    data: TicketAssign,
    db: Session = Depends(get_db),
    user=Depends(require_roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN))
):
    ticket = db.query(Ticket).get(ticket_id)
    if not ticket:
        raise HTTPException(404, "Ticket not found")

    ticket.assigned_to = data.engineer_id
    db.commit()

    log(db, ticket.id, "ASSIGNED", f"Assigned to engineer {data.engineer_id}", user.id)
    return {"message": "Assigned"}

# Engineer updates status
@router.post("/{ticket_id}/status")
def update_status(
    ticket_id: int,
    data: TicketStatusUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_roles(RoleEnum.ENGINEER))
):
    ticket = db.query(Ticket).get(ticket_id)
    if not ticket:
        raise HTTPException(404, "Ticket not found")

    ticket.status = data.status
    db.commit()

    msg = f"Status changed to {data.status}"
    if data.comment:
        msg += f" | {data.comment}"

    log(db, ticket.id, "STATUS_CHANGE", msg, user.id)
    return {"message": "Updated"}



@router.get("/assigned")
def assigned_tickets(
    db: Session = Depends(get_db),
    user=Depends(require_roles(RoleEnum.ENGINEER))
):
    tickets = db.query(Ticket).filter(Ticket.assigned_to == user.id).all()

    return [
        {
            "id": t.id,
            "issue": t.issue,
            "status": t.status,
            "priority": t.priority,
            "customer_name": t.customer.name if t.customer else "-",
            "project_name": t.project.name if t.project else "-",
            "site_name": t.site.name if t.site else "-",
            "equipment": t.equipment,
            "created_at": t.created_at,
        }
        for t in tickets
    ]


@router.get("/{ticket_id}")
def get_ticket_detail(
    ticket_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_roles(
        RoleEnum.SUPER_ADMIN,
        RoleEnum.ADMIN,
        RoleEnum.ENGINEER,
        RoleEnum.CUSTOMER
    ))
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(404, "Ticket not found")

    logs = (
        db.query(TicketLog)
        .filter(TicketLog.ticket_id == ticket_id)
        .order_by(TicketLog.timestamp.asc())
        .all()
    )

    return {
        "ticket": {
            "id": ticket.id,
            "customer_id": ticket.customer_id,
            "project_id": ticket.project_id,
            "site_id": ticket.site_id,
            "equipment": ticket.equipment,
            "issue": ticket.issue,
            "status": ticket.status,
            "assigned_to": ticket.assigned_to,
        },
        "timeline": [
            {
                "action": l.action,
                "message": l.message,
                "user_id": l.user_id,
                "timestamp": l.timestamp,
            }
            for l in logs
        ],
    }

@router.get("/")
def list_all_tickets(
    db: Session = Depends(get_db),
    user=Depends(require_roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN))
):
    tickets = db.query(Ticket).all()

    result = []
    for t in tickets:
        result.append({
            "id": t.id,
            "status": t.status,
            "issue": t.issue,
            "engineer_id": t.assigned_to,
            "customer_name": t.customer.name if t.customer else "-",
            "project_name": t.project.name if t.project else "-",
            "site_name": t.site.name if t.site else "-",
        })

    return result
