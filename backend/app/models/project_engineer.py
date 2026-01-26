# app/models/project_engineer.py
from sqlalchemy import Table, Column, Integer, ForeignKey
from app.database import Base

project_engineers = Table(
    "project_engineers",
    Base.metadata,
    Column("project_id", Integer, ForeignKey("projects.id", ondelete="CASCADE")),
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE")),
)
