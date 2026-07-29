from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class ClaimCreate(BaseModel):
    itemId: str
    verificationDetails: str
    fullName: str
    studentId: Optional[str] = None
    phone: str

class ClaimResponse(BaseModel):
    success: bool
    claimId: str

class Claim(BaseModel):
    id: int
    match_id: int
    claimer_name: str
    contact: str
    verification_answers: str
    status: str

    class Config:
        from_attributes = True
