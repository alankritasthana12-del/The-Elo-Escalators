from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.lost_item import LostItem
from app.models.found_item import FoundItem
from app.models.match import Match
from app.schemas.dashboard import DashboardResponse
from app.services.match_service import get_latest_matches

def get_dashboard_analytics(db: Session) -> DashboardResponse:
    total_lost = db.query(LostItem).count()
    total_found = db.query(FoundItem).count()
    total_reports = total_lost + total_found
    
    recovered_items = db.query(LostItem).filter(LostItem.status == "recovered").count()
    pending_items = db.query(LostItem).filter(LostItem.status == "pending").count()
    
    ai_matches = db.query(Match).count()
    
    # Most lost category
    most_lost_category_res = db.query(LostItem.category, func.count(LostItem.id).label('count')) \
        .group_by(LostItem.category).order_by(func.count(LostItem.id).desc()).first()
    most_lost_category = most_lost_category_res[0] if most_lost_category_res else "N/A"
    
    # Most lost location
    most_lost_location_res = db.query(LostItem.location, func.count(LostItem.id).label('count')) \
        .group_by(LostItem.location).order_by(func.count(LostItem.id).desc()).first()
    most_lost_location = most_lost_location_res[0] if most_lost_location_res else "N/A"
    
    recovery_rate = (recovered_items / total_lost * 100) if total_lost > 0 else 0.0
    
    # Recent reports
    recent_lost = db.query(LostItem).order_by(LostItem.created_at.desc()).limit(5).all()
    recent_reports = [
        {"id": item.id, "title": item.title, "type": "lost", "date": item.date}
        for item in recent_lost
    ]
    
    recent_matches = get_latest_matches(db, limit=5)
    
    return DashboardResponse(
        total_reports=total_reports,
        recovered_items=recovered_items,
        pending_items=pending_items,
        ai_matches=ai_matches,
        most_lost_category=most_lost_category,
        most_lost_location=most_lost_location,
        recovery_rate=recovery_rate,
        recent_reports=recent_reports,
        recent_matches=recent_matches
    )
