from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LostItemBase(BaseModel):
    title: str
    description: str
    category: str
    location: str
    date: datetime

class LostItemCreate(LostItemBase):
    pass
    # image will be handled as UploadFile in the API

class LostItemResponse(BaseModel):
    success: bool
    id: int
    message: str

class LostItem(LostItemBase):
    id: int
    image_path: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
