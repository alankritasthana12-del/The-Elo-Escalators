from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
import datetime
from app.database.database import Base

class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    lost_item_id = Column(Integer, ForeignKey("lost_items.id"))
    found_item_id = Column(Integer, ForeignKey("found_items.id"))
    similarity = Column(Float)
    confidence = Column(Float)
    reason = Column(String)  # Store JSON as string: list of reasons
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
