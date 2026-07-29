from pydantic import BaseModel
from typing import List, Dict, Any
from app.schemas.match import MatchResponse

class DashboardResponse(BaseModel):
    total_reports: int
    recovered_items: int
    pending_items: int
    ai_matches: int
    most_lost_category: str
    most_lost_location: str
    recovery_rate: float
    recent_reports: List[Dict[str, Any]]
    recent_matches: List[MatchResponse]
