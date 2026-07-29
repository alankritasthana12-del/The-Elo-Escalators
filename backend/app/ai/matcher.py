import faiss
import numpy as np
import os
from app.config.settings import settings
import math

_index = None
_dimension = 384  # all-MiniLM-L6-v2 dimension

def load_faiss_index():
    global _index
    index_file = os.path.join(settings.FAISS_PATH, "items.index")
    if os.path.exists(index_file):
        _index = faiss.read_index(index_file)
    else:
        # Use IndexIDMap to map internal FAISS ids to our database IDs
        # Cosine similarity requires inner product and normalized vectors
        # all-MiniLM-L6-v2 returns normalized vectors usually, but IndexFlatIP does dot product.
        base_index = faiss.IndexFlatIP(_dimension)
        _index = faiss.IndexIDMap(base_index)

def save_faiss_index():
    if _index is not None:
        index_file = os.path.join(settings.FAISS_PATH, "items.index")
        faiss.write_index(_index, index_file)

def add_to_index(item_id: int, embedding: list[float]):
    if _index is None:
        raise RuntimeError("FAISS index not loaded")
    
    vec = np.array([embedding], dtype=np.float32)
    faiss.normalize_L2(vec)
    _index.add_with_ids(vec, np.array([item_id], dtype=np.int64))
    save_faiss_index()

def search_index(embedding: list[float], top_k: int = 5):
    if _index is None:
        raise RuntimeError("FAISS index not loaded")
    
    if _index.ntotal == 0:
        return [], []
        
    vec = np.array([embedding], dtype=np.float32)
    faiss.normalize_L2(vec)
    
    k = min(top_k, _index.ntotal)
    distances, indices = _index.search(vec, k)
    
    return indices[0].tolist(), distances[0].tolist()
