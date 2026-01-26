from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User, RoleEnum
from app.schemas.user import LoginRequest
from app.core.security import verify_password, create_access_token, hash_password

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    # Email hi exist nahi karti
    if not user:
        raise HTTPException(status_code=401, detail="Enter Valid Email")

    # Email mil gayi, par password galat
    if not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect password")

    login_time = datetime.now().strftime("%I:%M %p")
    
    token = create_access_token({
        "user_id": user.id,
        "role": user.role.value,
        "name": user.name,
        "email": user.email,
        "loginTime": login_time
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role.value,
        "name": user.name
    }
