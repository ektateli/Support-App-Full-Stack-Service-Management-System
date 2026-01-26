import os
from datetime import datetime

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.bulk_upload import BulkUpload   
from app.core.rbac import require_roles
from app.models.user import RoleEnum

UPLOAD_DIR = "uploads"

router = APIRouter(tags=["Bulk Upload"])

# Upload file
@router.post("/bulk-upload")
def bulk_upload(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _=Depends(require_roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN))
):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    path = os.path.join(UPLOAD_DIR, file.filename)
    with open(path, "wb") as f:
        f.write(file.file.read())

    record = BulkUpload(
        filename=file.filename,
        status="UPLOADED"
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "id": record.id,
        "filename": record.filename,
        "status": record.status,
        "created_at": record.created_at,
        "message": "File saved "
    }

# List uploaded files (history)
@router.get("/bulk-upload")
def list_uploads(
    db: Session = Depends(get_db),
    _=Depends(require_roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN))
):
    return db.query(BulkUpload).order_by(BulkUpload.created_at.desc()).all()
