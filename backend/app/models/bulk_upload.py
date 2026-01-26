
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base
import pytz

IST = pytz.timezone("Asia/Kolkata")

class BulkUpload(Base):
    __tablename__ = "bulk_uploads"

    id = Column(Integer, primary_key=True)
    filename = Column(String(255))
    status = Column(String(50), default="PENDING")
    created_at = Column(DateTime, default=lambda: datetime.now(IST))
