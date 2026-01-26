from pydantic import BaseModel
from typing import Optional

class SiteCreate(BaseModel):
    project_id: int
    name: str
    equipment_name: str
    vendor: str
    quantity: int
    remarks: str | None = None

class SiteOut(BaseModel):
    id: int
    project_id: int
    name: str
    equipment_name: str
    vendor: str
    quantity: int
    remarks: str | None = None
    project_name: Optional[str] = None


    class Config:
        from_attributes = True
