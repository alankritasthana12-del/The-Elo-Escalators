from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.database import Base

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(Integer, ForeignKey("matches.id"))
    claimer_name = Column(String)
    contact = Column(String)
    verification_answers = Column(String)  # Store JSON as string
    status = Column(String, default="pending")  # pending, approved, rejected
