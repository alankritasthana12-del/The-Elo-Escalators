from pydantic import BaseModel
from typing import List
from app.schemas.lost_item import LostItem
from app.schemas.found_item import FoundItem

class SearchRequest(BaseModel):
    query: str

class SearchResponse(BaseModel):
    results: List[dict] # Mixed list of items with their confidence score
