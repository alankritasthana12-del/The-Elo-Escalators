from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class ClaimBase(BaseModel):
    match_id: int
    claimer_name: str
    contact: str
    verification_answers: Dict[str, str]

class ClaimCreate(ClaimBase):
    pass

class ClaimResponse(BaseModel):
    success: bool
    status: str

class Claim(BaseModel):
    id: int
    match_id: int
    claimer_name: str
    contact: str
    verification_answers: str
    status: str

    class Config:
        from_attributes = True
