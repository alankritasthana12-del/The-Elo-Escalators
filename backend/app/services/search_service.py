from sqlalchemy.orm import Session
from app.ai.embedding import get_embedding
from app.ai.matcher import search_index
from app.models.lost_item import LostItem
from app.models.found_item import FoundItem

def search_semantic(db: Session, query: str):
    embedding = get_embedding(query)
    indices, distances = search_index(embedding, top_k=5)
    
    results = []
    for i, idx in enumerate(indices):
        if idx == -1:
            continue
            
        if idx >= 1000000:
            found_id = idx - 1000000
            found_item = db.query(FoundItem).filter(FoundItem.id == int(found_id)).first()
            if found_item:
                results.append({
                    "id": f"found-{found_item.id}",
                    "title": found_item.title,
                    "description": found_item.description,
                    "category": found_item.category,
                    "location": found_item.location,
                    "date": str(found_item.date) if found_item.date else "",
                    "status": found_item.status,
                    "image": f"http://localhost:8000/{found_item.image_path.replace(chr(92), '/')}" if getattr(found_item, 'image_path', None) else None,
                    "similarity_score": float(distances[i]),
                    "type": "found"
                })
        else:
            lost_item = db.query(LostItem).filter(LostItem.id == int(idx)).first()
            if lost_item:
                results.append({
                    "id": f"lost-{lost_item.id}",
                    "title": lost_item.title,
                    "description": lost_item.description,
                    "category": lost_item.category,
                    "location": lost_item.location,
                    "date": str(lost_item.date) if lost_item.date else "",
                    "status": lost_item.status,
                    "image": f"http://localhost:8000/{lost_item.image_path.replace(chr(92), '/')}" if getattr(lost_item, 'image_path', None) else None,
                    "similarity_score": float(distances[i]),
                    "type": "lost"
                })
            
    return results
