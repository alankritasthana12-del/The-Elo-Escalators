def calculate_confidence(lost_item, found_item, semantic_similarity: float, found_ocr_text: str = "") -> tuple[float, list[str]]:
    reasons = []
    
    # 1. Semantic Similarity (60%)
    sim = max(0.0, min(1.0, semantic_similarity))
    score_semantic = sim * 60.0
    if sim > 0.7:
        reasons.append("High semantic similarity in descriptions and AI analysis")
    elif sim > 0.4:
        reasons.append("Moderate semantic similarity")
        
    # 2. OCR Match (20%)
    score_ocr = 0.0
    if found_ocr_text:
        # Check if any significant word from lost item title/desc/ocr is in found OCR text
        lost_text_parts = [lost_item.title, lost_item.description]
        if hasattr(lost_item, 'ocr_text') and lost_item.ocr_text:
            lost_text_parts.append(lost_item.ocr_text)
            
        lost_words = set(" ".join([str(p) for p in lost_text_parts if p]).lower().split())
        lost_words = {w for w in lost_words if len(w) > 3}  # Filter out short words
        ocr_lower = found_ocr_text.lower()
        
        match_found = False
        for w in lost_words:
            if w in ocr_lower:
                match_found = True
                reasons.append(f"OCR detected '{w}'")
                break
        
        if match_found:
            score_ocr = 20.0
            
    # 3. Location Similarity (10%)
    score_location = 0.0
    if lost_item.location and found_item.location:
        if lost_item.location.lower().strip() == found_item.location.lower().strip():
            score_location = 10.0
            reasons.append("Same location")
        else:
            # Partial match
            lost_loc_words = set(lost_item.location.lower().split())
            found_loc_words = set(found_item.location.lower().split())
            if lost_loc_words.intersection(found_loc_words):
                score_location = 5.0
                reasons.append("Similar location")
                
    # 4. Date Similarity (10%)
    score_date = 0.0
    if lost_item.date and found_item.date:
        diff = abs((found_item.date - lost_item.date).days)
        if diff <= 1:
            score_date = 10.0
            reasons.append("Reported within 1 day")
        elif diff <= 7:
            score_date = 5.0
            reasons.append("Reported within a week")
            
    # Note: Category match is no longer part of the confidence score but remains in the DB
            
    total_confidence = score_semantic + score_ocr + score_location + score_date
    
    return total_confidence, reasons
