import os
import uuid
import json
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.models.found_item import FoundItem
from app.models.lost_item import LostItem
from app.models.match import Match
from app.schemas.found_item import FoundItemCreate
from app.schemas.match import MatchResponse
from app.config.settings import settings
from app.ai.embedding import get_embedding
from app.ai.ocr import extract_text
from app.ai.matcher import search_index
from app.ai.explainability import calculate_confidence
from app.utils.image_utils import process_and_save_image

async def process_found_item(db: Session, item: FoundItemCreate, image: UploadFile = None):
    image_path = None
    ocr_text = ""
    
    if image:
        filename = f"{uuid.uuid4()}_{image.filename}"
        image_path = os.path.join(settings.UPLOAD_FOLDER, filename)
        # Resize and compress
        process_and_save_image(image, image_path)
        # Extract text via Fast OCR
        ocr_text = extract_text(image_path)
        
    combined_text = f"{ocr_text} {item.description}"
    if item.title:
        combined_text = f"{item.title} {combined_text}"
    if item.category:
        combined_text = f"{combined_text} {item.category}"
    if item.location:
        combined_text = f"{combined_text} {item.location}"
        
    embedding = get_embedding(combined_text)
    
    db_item = FoundItem(
        title=item.title or "",
        description=item.description,
        category=item.category or "",
        location=item.location or "",
        date=item.date,
        image_path=image_path,
        ocr_text=ocr_text,
        embedding=json.dumps(embedding)
    )
    
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    
    # Add to FAISS Index with offset
    from app.ai.matcher import add_to_index
    add_to_index(db_item.id + 1000000, embedding)
    
    # Search FAISS
    indices, distances = search_index(embedding, top_k=5)
    
    match_responses = []
    
    for i, lost_id in enumerate(indices):
        if lost_id == -1:
            continue
            
        lost_item = db.query(LostItem).filter(LostItem.id == int(lost_id)).first()
        if not lost_item:
            continue
            
        semantic_sim = float(distances[i])
        confidence_score, reasons = calculate_confidence(lost_item, db_item, semantic_sim, ocr_text)
        
        if confidence_score > 0:
            match_db = Match(
                lost_item_id=lost_item.id,
                found_item_id=db_item.id,
                similarity=semantic_sim,
                confidence=confidence_score,
                reason=json.dumps(reasons)
            )
            db.add(match_db)
            db.commit()
            db.refresh(match_db)
            
            match_responses.append(
                MatchResponse(
                    id=match_db.id,
                    lost_item_id=match_db.lost_item_id,
                    found_item_id=match_db.found_item_id,
                    confidence=match_db.confidence,
                    reasons=reasons,
                    created_at=match_db.created_at
                )
            )
            
    # Sort matches by confidence
    match_responses.sort(key=lambda x: x.confidence, reverse=True)
            
    return db_item, match_responses

def get_found_items(db: Session, skip: int = 0, limit: int = 100):
    return db.query(FoundItem).offset(skip).limit(limit).all()
