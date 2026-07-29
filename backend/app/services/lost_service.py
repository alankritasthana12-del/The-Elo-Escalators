import os
import uuid
import json
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.models.lost_item import LostItem
from app.schemas.lost_item import LostItemCreate
from app.config.settings import settings
from app.ai.embedding import get_embedding
from app.ai.matcher import add_to_index
from app.ai.ocr import extract_text
from app.utils.image_utils import process_and_save_image

async def create_lost_item(db: Session, item: LostItemCreate, image: UploadFile = None):
    image_path = None
    ocr_text = ""
    
    if image:
        filename = f"{uuid.uuid4()}_{image.filename}"
        image_path = os.path.join(settings.UPLOAD_FOLDER, filename)
        # Resize and compress
        process_and_save_image(image, image_path)
        # Extract text via Fast OCR
        ocr_text = extract_text(image_path)
            
    # Combine text for embedding
    combined_text = f"{item.title} {item.description} {item.category} {item.location} {ocr_text}"
    
    # Get Embedding
    embedding = get_embedding(combined_text)
    
    db_item = LostItem(
        title=item.title,
        description=item.description,
        category=item.category,
        location=item.location,
        date=item.date,
        image_path=image_path,
        ocr_text=ocr_text,
        embedding=json.dumps(embedding) # Store JSON string in DB
    )
    
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    
    # Add to FAISS Index
    add_to_index(db_item.id, embedding)
    
    return db_item

def get_lost_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(LostItem).offset(skip).limit(limit).all()
