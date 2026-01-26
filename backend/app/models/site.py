from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Site(Base):
    __tablename__ = "sites"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    name = Column(String(150), nullable=False)  
    equipment_name = Column(String(150), nullable=False)
    vendor = Column(String(150), nullable=False)
    quantity = Column(Integer, nullable=False)
    remarks = Column(String(255), nullable=True)

    project = relationship("Project", backref="sites")
