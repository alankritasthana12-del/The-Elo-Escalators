from sqlalchemy.orm import Session
from app.models.match import Match
import json
from app.schemas.match import MatchResponse

def get_latest_matches(db: Session, limit: int = 20):
    matches = db.query(Match).order_by(Match.created_at.desc()).limit(limit).all()
    
    responses = []
    for m in matches:
        responses.append(
            MatchResponse(
                id=m.id,
                lost_item_id=m.lost_item_id,
                found_item_id=m.found_item_id,
                confidence=m.confidence,
                reasons=json.loads(m.reason) if m.reason else [],
                created_at=m.created_at
            )
        )
    return responses
