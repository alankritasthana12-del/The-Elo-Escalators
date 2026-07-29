import os
import json
from app.database.database import SessionLocal
from app.models.lost_item import LostItem
from app.models.found_item import FoundItem
from app.ai.matcher import _index, faiss, settings, _dimension, save_faiss_index
import numpy as np

def rebuild_index():
    print("Rebuilding FAISS index...")
    db = SessionLocal()
    
    # Create fresh index
    base_index = faiss.IndexFlatIP(_dimension)
    new_index = faiss.IndexIDMap(base_index)
    
    # Add Lost items
    lost_items = db.query(LostItem).all()
    print(f"Adding {len(lost_items)} lost items...")
    for item in lost_items:
        if item.embedding:
            emb = json.loads(item.embedding)
            vec = np.array([emb], dtype=np.float32)
            faiss.normalize_L2(vec)
            new_index.add_with_ids(vec, np.array([item.id], dtype=np.int64))
            
    # Add Found items
    found_items = db.query(FoundItem).all()
    print(f"Adding {len(found_items)} found items...")
    for item in found_items:
        if item.embedding:
            emb = json.loads(item.embedding)
            vec = np.array([emb], dtype=np.float32)
            faiss.normalize_L2(vec)
            new_index.add_with_ids(vec, np.array([item.id + 1000000], dtype=np.int64))
            
    # Save directly using faiss.write_index instead of relying on the global
    index_file = os.path.join(settings.FAISS_PATH, "items.index")
    faiss.write_index(new_index, index_file)
    print("Done rebuilding index!")
    db.close()

if __name__ == "__main__":
    rebuild_index()
