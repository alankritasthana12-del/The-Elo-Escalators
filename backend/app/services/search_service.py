from sqlalchemy.orm import Session
from app.ai.embedding import get_embedding
from app.ai.matcher import search_index
from app.models.lost_item import LostItem

def search_semantic(db: Session, query: str):
    embedding = get_embedding(query)
    indices, distances = search_index(embedding, top_k=5)
    
    results = []
    for i, lost_id in enumerate(indices):
        if lost_id == -1:
            continue
            
        lost_item = db.query(LostItem).filter(LostItem.id == int(lost_id)).first()
        if lost_item:
            results.append({
                "id": lost_item.id,
                "title": lost_item.title,
                "description": lost_item.description,
                "category": lost_item.category,
                "location": lost_item.location,
                "similarity_score": float(distances[i]),
                "type": "lost"
            })
            
    return results
