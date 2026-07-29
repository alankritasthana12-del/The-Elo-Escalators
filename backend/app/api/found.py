from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.found_item import FoundItemCreate, FoundItemResponse
from app.services.found_service import process_found_item
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/api/found", tags=["Found Items"])

@router.post("", response_model=FoundItemResponse)
async def report_found_item(
    description: str = Form(...),
    title: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    date: Optional[str] = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    item_date = datetime.fromisoformat(date) if date else datetime.utcnow()
    item_create = FoundItemCreate(
        title=title,
        description=description,
        category=category,
        location=location,
        date=item_date
    )
    db_item, matches = await process_found_item(db, item_create, image)
    
    return FoundItemResponse(
        success=True,
        id=db_item.id,
        matches=matches
    )
