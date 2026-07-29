from pydantic import BaseModel
from typing import List, Dict, Any
from app.schemas.match import MatchResponse

class DashboardResponse(BaseModel):
    totalReports: int
    recovered: int
    pending: int
    aiMatches: int
    topCategory: str
    topLocation: str
    recoveryRate: float
    recentReports: List[Dict[str, Any]]
    chartData: List[Dict[str, Any]] = []
    categoryData: List[Dict[str, Any]] = []
