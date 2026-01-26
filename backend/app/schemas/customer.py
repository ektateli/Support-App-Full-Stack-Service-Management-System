from pydantic import BaseModel
from datetime import datetime

class CustomerCreate(BaseModel):
    name: str

class CustomerOut(BaseModel):
    id: int
    customer_code: str
    name: str
    created_at: datetime

    class Config:
        from_attributes = True
