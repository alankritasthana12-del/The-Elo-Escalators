from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.lost_item import LostItem
from app.models.found_item import FoundItem
import json

router = APIRouter(prefix="/api/items", tags=["Items"])

@router.get("/{item_id}")
def get_item(item_id: str, db: Session = Depends(get_db)):
    if "-" not in item_id:
        raise HTTPException(status_code=400, detail="Invalid item ID format")
        
    prefix, db_id = item_id.split("-", 1)
    
    try:
        db_id = int(db_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid item ID")

    if prefix == "lost":
        item = db.query(LostItem).filter(LostItem.id == db_id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        
        return {
            "id": f"lost-{item.id}",
            "title": item.title,
            "description": item.description,
            "category": item.category,
            "location": item.location,
            "date": item.date,
            "type": "lost",
            "status": item.status,
            "reportedAt": item.created_at.isoformat() if item.created_at else None,
            "image": f"http://localhost:8000/{item.image_path.replace(chr(92), '/')}" if getattr(item, 'image_path', None) else None,
            "aiAnalysis": {
                "detectedType": "Unknown",
                "detectedBrand": "Unknown",
                "detectedColour": "Unknown",
                "visibleText": item.ocr_text or "None",
                "additionalNotes": "Lost items do not have full AI visual analysis yet."
            }
        }
        
    elif prefix == "found":
        item = db.query(FoundItem).filter(FoundItem.id == db_id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
            
        return {
            "id": f"found-{item.id}",
            "title": item.title or "Found Item",
            "description": item.description,
            "category": item.category or "Unknown",
            "location": item.location,
            "date": item.date,
            "type": "found",
            "status": item.status,
            "reportedAt": item.created_at.isoformat() if item.created_at else None,
            "image": f"http://localhost:8000/{item.image_path.replace(chr(92), '/')}" if getattr(item, 'image_path', None) else None,
            "aiAnalysis": {
                "detectedType": item.category or "Unknown",
                "detectedBrand": "Unknown",
                "detectedColour": "Unknown",
                "visibleText": item.ocr_text or "None",
                "additionalNotes": "Based on provided details."
            }
        }
    else:
        raise HTTPException(status_code=400, detail="Unknown item prefix")
