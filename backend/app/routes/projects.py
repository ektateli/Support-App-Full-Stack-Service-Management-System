from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.project import Project
from app.models.customer import Customer
from app.schemas.project import ProjectCreate, ProjectOut
from app.models.user import RoleEnum
from app.core.rbac import require_roles
from sqlalchemy.orm import joinedload
from app.models.user import User


router = APIRouter(prefix="/projects", tags=["Projects"])

# Create Project (Admin only)
@router.post("/", response_model=ProjectOut)
def create_project(
    data: ProjectCreate,
    db: Session = Depends(get_db),
    _=Depends(require_roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN))
):
    customer = db.query(Customer).filter(Customer.id == data.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    project = Project(
        customer_id=data.customer_id,
        name=data.name,
        project_code=data.project_code,
        project_type=data.project_type,
        region=data.region,
        
    )
    
    if data.engineer_ids:
        engineers = db.query(User).filter(User.id.in_(data.engineer_ids)).all()
        project.engineers = engineers
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

# List Projects (Admin, Engineer)
@router.get("/", response_model=list[ProjectOut])
def list_projects(
    customer_id: int | None = None,
    db: Session = Depends(get_db),
    _=Depends(require_roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.ENGINEER,RoleEnum.CUSTOMER ))
):
    q = db.query(Project).options(joinedload(Project.engineers),joinedload(Project.customer))
    if customer_id:
        q = q.filter(Project.customer_id == customer_id)
    return q.all()




from app.models.user import User
from app.models.project import project_engineers

@router.put("/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: int,
    data: ProjectCreate,
    db: Session = Depends(get_db),
    _=Depends(require_roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN))
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # basic fields update
    project.name = data.name
    project.project_code = data.project_code
    project.project_type = data.project_type
    project.region = data.region
    project.customer_id = data.customer_id

    # clear old engineers
    db.execute(
        project_engineers.delete().where(
            project_engineers.c.project_id == project_id
        )
    )

    # assign new engineers
    for uid in getattr(data, "engineer_ids", []):
        db.execute(
            project_engineers.insert().values(
                project_id=project_id,
                user_id=uid
            )
        )

    db.commit()
    db.refresh(project)
    return project



@router.delete("/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN))
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # pehle mapping table se engineers unlink karo
    db.execute(
        project_engineers.delete().where(
            project_engineers.c.project_id == project_id
        )
    )

    # phir project delete karo
    db.delete(project)
    db.commit()

    return {"message": "Project deleted successfully"}
