from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerOut
from app.models.user import RoleEnum
from app.core.rbac import require_roles
from sqlalchemy import text

router = APIRouter(prefix="/customers", tags=["Customers"])

def generate_customer_code(db: Session) -> str:
    last = db.query(Customer).order_by(Customer.id.desc()).first()
    if not last:
        return "CUST-001"
    last_num = int(last.customer_code.split("-")[1])
    return f"CUST-{last_num + 1:03d}"

# Create Customer (Admin only)
@router.post("/", response_model=CustomerOut)
def create_customer(
    data: CustomerCreate,
    db: Session = Depends(get_db),
    _=Depends(require_roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN))
):
    code = generate_customer_code(db)
    customer = Customer(customer_code=code, name=data.name)
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer

# List Customers (Admin, Engineer)
@router.get("/", response_model=list[CustomerOut])
def list_customers(
    db: Session = Depends(get_db),
    _=Depends(require_roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.ENGINEER))
):
    return db.query(Customer).all()

@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN))
):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    db.execute(text("DELETE FROM projects WHERE customer_id = :cid"), {"cid": customer_id})
    db.delete(customer)
    db.commit()
    return {"message": "Customer deleted successfully"}



@router.put("/{customer_id}", response_model=CustomerOut)
def update_customer(
    customer_id: int,
    data: CustomerCreate,
    db: Session = Depends(get_db),
    _=Depends(require_roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN))
):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    customer.name = data.name

    db.commit()
    db.refresh(customer)
    return customer
