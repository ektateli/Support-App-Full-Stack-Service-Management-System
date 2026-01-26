from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.project_engineer import project_engineers


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)

    name = Column(String(150), nullable=False)
    project_code = Column(String(50), nullable=False)
    project_type = Column(String(50), nullable=False)
    region = Column(String(50), nullable=False)

    customer = relationship("Customer", backref="projects")
    engineers = relationship(
        "User",
        secondary=project_engineers,
        backref="projects"
    )
