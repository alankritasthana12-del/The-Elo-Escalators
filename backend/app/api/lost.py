from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.lost_item import LostItemCreate, LostItemResponse
from app.services.lost_service import create_lost_item
from datetime import datetime

router = APIRouter(prefix="/api/lost", tags=["Lost Items"])

@router.post("", response_model=LostItemResponse)
async def report_lost_item(
    title: str = Form(...),
    description: str = Form(...),
    category: str = Form(...),
    location: str = Form(...),
    date: str = Form(...), # expecting ISO format string
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    item_date = datetime.fromisoformat(date)
    item_create = LostItemCreate(
        title=title,
        description=description,
        category=category,
        location=location,
        date=item_date
    )
    db_item = await create_lost_item(db, item_create, image)
    
    return LostItemResponse(
        success=True,
        id=db_item.id,
        message="Lost Item Registered"
    )
