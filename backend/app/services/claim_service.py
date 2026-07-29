import json
from sqlalchemy.orm import Session
from app.models.claim import Claim
from app.schemas.claim import ClaimCreate

def create_claim(db: Session, claim: ClaimCreate):
    # Extract integer ID from "lost-1" or "found-1"
    match_id = int(claim.itemId.split("-")[1]) if "-" in claim.itemId else 0
    
    db_claim = Claim(
        match_id=match_id,
        claimer_name=claim.fullName,
        contact=claim.phone,
        verification_answers=json.dumps({"details": claim.verificationDetails, "studentId": claim.studentId}),
        status="pending"
    )
    db.add(db_claim)
    db.commit()
    db.refresh(db_claim)
    return db_claim
