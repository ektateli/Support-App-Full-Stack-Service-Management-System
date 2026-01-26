from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.site import Site
from app.models.project import Project
from app.schemas.site import SiteCreate, SiteOut
from app.models.user import RoleEnum
from app.core.rbac import require_roles
from sqlalchemy.orm import joinedload

router = APIRouter(prefix="/sites", tags=["Sites"])

# Create Site (Admin only)
@router.post("/", response_model=SiteOut)
def create_site(
    data: SiteCreate,
    db: Session = Depends(get_db),
    _=Depends(require_roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN))
):
    project = db.query(Project).filter(Project.id == data.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    site = Site(
        project_id=data.project_id,
        name=data.name,
        equipment_name=data.equipment_name,
        vendor=data.vendor,
        quantity=data.quantity,
        remarks=data.remarks,
    )
    db.add(site)
    db.commit()
    db.refresh(site)
    return site

# List Sites (Admin, Engineer, Customer - read-only)
@router.get("/", response_model=list[SiteOut])
def list_sites(
    project_id: int | None = None,
    db: Session = Depends(get_db),
    _=Depends(require_roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN, RoleEnum.ENGINEER, RoleEnum.CUSTOMER))
):
    q = db.query(Site).options(joinedload(Site.project))

    if project_id:
        q = q.filter(Site.project_id == project_id)

    sites = q.all()

    # project_name attach karo
    result = []
    for s in sites:
        s.project_name = s.project.name if s.project else None
        result.append(s)

    return result




# Update Site (Admin only)
@router.put("/{site_id}", response_model=SiteOut)
def update_site(
    site_id: int,
    data: SiteCreate,
    db: Session = Depends(get_db),
    _=Depends(require_roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN))
):
    site = db.query(Site).filter(Site.id == site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    project = db.query(Project).filter(Project.id == data.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    # update fields
    site.name = data.name
    site.project_id = data.project_id
    site.equipment_name = data.equipment_name
    site.vendor = data.vendor
    site.quantity = data.quantity
    site.remarks = data.remarks

    db.commit()
    db.refresh(site)

    # project_name attach
    site.project_name = project.name
    return site


# Delete Site (Admin only)
@router.delete("/{site_id}")
def delete_site(
    site_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN))
):
    site = db.query(Site).filter(Site.id == site_id).first()
    if not site:
        raise HTTPException(status_code=404, detail="Site not found")

    db.delete(site)
    db.commit()

    return {"message": "Site deleted successfully"}
