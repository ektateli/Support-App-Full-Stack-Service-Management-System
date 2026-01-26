from fastapi import FastAPI
from app.database import Base, engine, SessionLocal
from app.models.user import User, RoleEnum
from app.core.security import hash_password
from app.routes import bulk_upload
from app.routes import auth, users, customers, projects, sites, tickets
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Support App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# Auto-create SUPER_ADMIN if not exists
def create_super_admin():
    db = SessionLocal()
    exists = db.query(User).filter(User.role == RoleEnum.SUPER_ADMIN).first()
    if not exists:
        admin = User(
            name="Super Admin",
            email="superadmin@support.com",
            password_hash=hash_password("admin123"),
            role=RoleEnum.SUPER_ADMIN
        )
        db.add(admin)
        db.commit()
    db.close()

create_super_admin()

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(customers.router)
app.include_router(projects.router)
app.include_router(sites.router)
app.include_router(tickets.router)
app.include_router(bulk_upload.router)

@app.get("/")
def root():
    return {"status": "Support App Backend Running"}
