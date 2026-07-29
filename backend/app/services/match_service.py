from sqlalchemy.orm import Session
from app.models.match import Match
import json
from app.schemas.match import MatchResponse, ItemSnippet
from app.models.lost_item import LostItem
from app.models.found_item import FoundItem

def get_latest_matches(db: Session, limit: int = 20):
    matches = db.query(Match).order_by(Match.created_at.desc()).limit(limit).all()
    
    responses = []
    for m in matches:
        lost = db.query(LostItem).filter(LostItem.id == m.lost_item_id).first()
        found = db.query(FoundItem).filter(FoundItem.id == m.found_item_id).first()
        
        if not lost or not found:
            continue
            
        responses.append(
            MatchResponse(
                id=m.id,
                lostItem=ItemSnippet(
                    id=f"lost-{lost.id}",
                    title=lost.title,
                    location=lost.location,
                    date=str(lost.date) if lost.date else "",
                    image=f"http://localhost:8000/{lost.image_path.replace(chr(92), '/')}" if getattr(lost, 'image_path', None) else None
                ),
                foundItem=ItemSnippet(
                    id=f"found-{found.id}",
                    title=found.title or "Found Item",
                    location=found.location,
                    date=str(found.date) if found.date else "",
                    image=f"http://localhost:8000/{found.image_path.replace(chr(92), '/')}" if getattr(found, 'image_path', None) else None
                ),
                confidence=m.confidence,
                reasons=json.loads(m.reason) if m.reason else [],
                status="pending",
                created_at=m.created_at
            )
        )
    return responses
