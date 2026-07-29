from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.claim import ClaimCreate, ClaimResponse
from app.services.claim_service import create_claim

router = APIRouter(prefix="/api/claim", tags=["Claims"])

@router.post("", response_model=ClaimResponse)
def submit_claim(claim: ClaimCreate, db: Session = Depends(get_db)):
    db_claim = create_claim(db, claim)
    return ClaimResponse(success=True, claimId=f"CLM-{db_claim.id}")
