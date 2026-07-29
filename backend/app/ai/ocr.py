import easyocr
import threading

_reader = None
_lock = threading.Lock()

def load_ocr_model():
    """Pre-loads OCR model. Called lazily on first use."""
    global _reader
    # No-op during startup — lazy load instead
    pass

def _get_reader():
    """Lazy-loads the EasyOCR reader on first actual use."""
    global _reader
    if _reader is None:
        with _lock:
            if _reader is None:
                print("Loading EasyOCR model (first use)...")
                _reader = easyocr.Reader(['en'], gpu=False)
                print("EasyOCR loaded.")
    return _reader

def extract_text(image_path: str) -> str:
    try:
        reader = _get_reader()
        results = reader.readtext(image_path)
        extracted_text = " ".join([text for (_, text, _) in results])
        return extracted_text.strip()
    except Exception as e:
        print(f"OCR error: {e}")
        return ""
