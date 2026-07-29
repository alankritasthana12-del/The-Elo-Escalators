from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard_service import get_dashboard_analytics

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    return get_dashboard_analytics(db)
