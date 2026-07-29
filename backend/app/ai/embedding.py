from sentence_transformers import SentenceTransformer
from app.config.settings import settings
import threading

_model = None
_lock = threading.Lock()

def load_embedding_model():
    """No-op on startup — lazy loads on first use to avoid blocking server."""
    pass

def _get_model():
    """Lazy-loads the SentenceTransformer model on first actual use."""
    global _model
    if _model is None:
        with _lock:
            if _model is None:
                print(f"Loading embedding model: {settings.MODEL_PATH}...")
                _model = SentenceTransformer(settings.MODEL_PATH)
                print("Embedding model loaded.")
    return _model

def get_embedding(text: str) -> list:
    model = _get_model()
    return model.encode(text).tolist()
