from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.match import MatchResponse

class FoundItemBase(BaseModel):
    title: Optional[str] = None
    description: str
    category: Optional[str] = None
    location: Optional[str] = None
    date: Optional[datetime] = None

class FoundItemCreate(FoundItemBase):
    pass
    # image will be handled as UploadFile in the API

class FoundItemResponse(BaseModel):
    success: bool
    id: int
    matches: List[MatchResponse]

class FoundItem(FoundItemBase):
    id: int
    image_path: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
