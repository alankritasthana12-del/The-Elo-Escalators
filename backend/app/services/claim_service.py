import json
from sqlalchemy.orm import Session
from app.models.claim import Claim
from app.schemas.claim import ClaimCreate

def create_claim(db: Session, claim: ClaimCreate):
    db_claim = Claim(
        match_id=claim.match_id,
        claimer_name=claim.claimer_name,
        contact=claim.contact,
        verification_answers=json.dumps(claim.verification_answers),
        status="pending"
    )
    db.add(db_claim)
    db.commit()
    db.refresh(db_claim)
    return db_claim
