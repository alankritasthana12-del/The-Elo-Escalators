from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.match import MatchResponse
from app.services.match_service import get_latest_matches

router = APIRouter(prefix="/api/matches", tags=["Matches"])

from typing import List, Dict, Any

@router.get("", response_model=Dict[str, List[MatchResponse]])
def get_matches(db: Session = Depends(get_db)):
    matches = get_latest_matches(db)
    return {"matches": matches}
