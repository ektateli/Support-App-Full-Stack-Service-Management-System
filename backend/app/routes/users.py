from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, RoleEnum
from app.models.customer import Customer
from app.schemas.user import UserCreate, UserOut, UserUpdate
from app.core.security import hash_password
from app.core.rbac import require_roles
import time
from sqlalchemy import text
from app.models.ticket import Ticket
from app.models.ticket_log import TicketLog

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/", response_model=UserOut)
def create_user(
    data: UserCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN))
):
    
    if current_user.role == RoleEnum.ADMIN and data.role == RoleEnum.ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Admins cannot create other Admin accounts."
        )

    if current_user.role == RoleEnum.ADMIN and data.role == RoleEnum.SUPER_ADMIN:
        raise HTTPException(
            status_code=403,
            detail="Only Super Admin can create Super Admin."
        )
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    customer_id = None

    # 🔥 Agar role CUSTOMER hai, to automatic Customer create karo
    if data.role == RoleEnum.CUSTOMER:
        last = db.query(Customer).order_by(Customer.id.desc()).first()
        if not last:
            code = "CUST-001"
        else:
            num = int(last.customer_code.split("-")[1])
            code = f"CUST-{num + 1:03d}"

        customer = Customer(
            name=data.name,
            customer_code=code
        )
        db.add(customer)
        db.commit()
        db.refresh(customer)

        customer_id = customer.id

    user = User(
        name=data.name,
        email=data.email,
        password_hash=hash_password(data.password),
        role=data.role,
        customer_id=customer_id
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

@router.get("/", response_model=list[UserOut])
def list_users(
    db: Session = Depends(get_db),
    _=Depends(require_roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN))
):
    return db.query(User).all()

# Delete User (Super Admin only)
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_roles(RoleEnum.SUPER_ADMIN))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.role == RoleEnum.SUPER_ADMIN:
        raise HTTPException(status_code=400, detail="Cannot delete Super Admin")

    # db.execute(text("DELETE FROM ticket_logs WHERE user_id = :uid"), {"uid": user_id})
    # 1️⃣ Ticket logs remove karo
    db.query(TicketLog).filter(TicketLog.user_id == user_id).delete()

    # 2️⃣ Tickets me created_by ko NULL karo
    db.query(Ticket).filter(Ticket.created_by == user_id).update(
        {Ticket.created_by: None}
    )
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}




 # naya schema banaana padega

@router.put("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    data: UserUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN))
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Email change kar rahe ho to duplicate check
    if data.email and data.email != user.email:
        existing = db.query(User).filter(User.email == data.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already exists")
        user.email = data.email

    if data.name:
        user.name = data.name

    if data.role:
        user.role = data.role

    if data.password:
        user.password_hash = hash_password(data.password)

    db.commit()
    db.refresh(user)
    return user
