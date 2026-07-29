from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.search import SearchRequest, SearchResponse
from app.services.search_service import search_semantic

router = APIRouter(prefix="/api/search", tags=["Search"])

@router.post("", response_model=SearchResponse)
def search_items(request: SearchRequest, db: Session = Depends(get_db)):
    results = search_semantic(db, request.query)
    return SearchResponse(results=results)
