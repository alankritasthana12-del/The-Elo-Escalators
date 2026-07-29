from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import json

class MatchBase(BaseModel):
    lost_item_id: int
    found_item_id: int
    similarity: float
    confidence: float
    reason: str

class MatchCreate(MatchBase):
    pass

class MatchResponse(BaseModel):
    id: int
    lost_item_id: int
    found_item_id: int
    confidence: float
    reasons: List[str]
    created_at: datetime

    class Config:
        from_attributes = True

class Match(MatchBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
