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

class ItemSnippet(BaseModel):
    id: str
    title: str
    location: str
    date: str
    image: Optional[str] = None

class MatchResponse(BaseModel):
    id: int
    lostItem: ItemSnippet
    foundItem: ItemSnippet
    confidence: float
    reasons: List[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class Match(MatchBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
