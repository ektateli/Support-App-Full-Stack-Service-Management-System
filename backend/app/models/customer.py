from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from datetime import datetime
import pytz

IST = pytz.timezone("Asia/Kolkata")

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    customer_code = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(IST))