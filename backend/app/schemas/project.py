from pydantic import BaseModel
from typing import List

class EngineerMini(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class CustomerMini(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    customer_id: int
    name: str
    project_code: str
    project_type: str
    region: str
    engineer_ids: List[int] = []

class ProjectOut(BaseModel):
    id: int
    customer_id: int
    name: str
    project_code: str
    project_type: str
    region: str
    customer: CustomerMini 
    engineers: List[EngineerMini] = []

    class Config:
        from_attributes = True
