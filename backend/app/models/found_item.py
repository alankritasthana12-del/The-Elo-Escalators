from sqlalchemy import Column, Integer, String, DateTime
import datetime
from app.database.database import Base

class FoundItem(Base):
    __tablename__ = "found_items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    category = Column(String, index=True)
    location = Column(String)
    date = Column(DateTime)
    image_path = Column(String, nullable=True)
    ocr_text = Column(String, nullable=True)
    embedding = Column(String, nullable=True)
    status = Column(String, default="pending")  # pending, claimed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
