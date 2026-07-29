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
    
    # Recent reports (mock some additional fields for frontend compatibility)
    recent_lost = db.query(LostItem).order_by(LostItem.created_at.desc()).limit(5).all()
    recent_reports = [
        {
            "id": f"lost-{item.id}", 
            "title": item.title, 
            "type": "lost", 
            "status": "searching", 
            "location": item.location, 
            "date": item.date
        }
        for item in recent_lost
    ]
    
    # Mock data for charts
    chartData = [
        {"name": "Mon", "lost": 5, "found": 3, "recovered": 1},
        {"name": "Tue", "lost": 8, "found": 4, "recovered": 2},
        {"name": "Wed", "lost": 3, "found": 6, "recovered": 3},
        {"name": "Thu", "lost": 7, "found": 5, "recovered": 2},
        {"name": "Fri", "lost": 6, "found": 8, "recovered": 4},
        {"name": "Sat", "lost": 2, "found": 3, "recovered": 1},
        {"name": "Sun", "lost": 1, "found": 2, "recovered": 1},
    ]
    
    categoryData = [
        {"name": "Electronics", "value": 15},
        {"name": "Accessories", "value": 8},
        {"name": "Documents", "value": 5},
        {"name": "Other", "value": 3},
    ]
    
    recent_matches = get_latest_matches(db, limit=5)
    
    return DashboardResponse(
        totalReports=total_reports,
        recovered=recovered_items,
        pending=pending_items,
        aiMatches=ai_matches,
        topCategory=most_lost_category,
        topLocation=most_lost_location,
        recoveryRate=recovery_rate,
        recentReports=recent_reports,
        chartData=chartData,
        categoryData=categoryData
    )
