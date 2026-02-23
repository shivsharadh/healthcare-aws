from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from sqlalchemy.orm import Session

from typing import List

from database import engine
from models import Base, User, Claim
from schemas import UserCreate, UserLogin, ClaimCreate, ClaimUpdate, ClaimResponse
from auth import hash_password, verify_password, create_access_token
from dependencies import get_db, get_current_user, require_role

# ─── Rate Limiter ─────────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Healthcare Claims API")

# ─── Rate limit error handler ─────────────────────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",       # Local frontend dev
        "http://localhost:8000",       # Local Swagger
        "http://healthcare-alb-2089454178.us-east-1.elb.amazonaws.com",  # ALB URL
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

Base.metadata.create_all(bind=engine)


# 🔹 REGISTER — rate limited to 5 attempts/minute
@app.post("/register")
@limiter.limit("5/minute")
def register(request: Request, user: UserCreate, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(
        username=user.username,
        password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created"}


# 🔹 LOGIN — rate limited to 10 attempts/minute (brute-force protection)
@app.post("/login")
@limiter.limit("10/minute")
def login(request: Request, user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.username == user.username).first()

    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(
        data={
            "sub": db_user.username,
            "role": db_user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


# 🔹 CLAIMS (Create)
@app.post("/claims", response_model=ClaimResponse)
def create_claim(
    claim: ClaimCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role not in ["hospital", "patient"]:
        raise HTTPException(status_code=403, detail="Not authorized to create claims")
    
    new_claim = Claim(
        patient_name=claim.patient_name,
        diagnosis=claim.diagnosis,
        amount=claim.amount,
        status="Pending",
        submitted_by=current_user.username
    )
    db.add(new_claim)
    db.commit()
    db.refresh(new_claim)
    return new_claim


# 🔹 CLAIMS (Read)
@app.get("/claims", response_model=List[ClaimResponse])
def get_claims(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == "insurance":
        return db.query(Claim).all()
    elif current_user.role == "hospital":
        return db.query(Claim).filter(Claim.submitted_by == current_user.username).all()
    elif current_user.role == "patient":
        return db.query(Claim).filter(
            (Claim.submitted_by == current_user.username) | 
            (Claim.patient_name == current_user.username)
        ).all()
    return []


# 🔹 CLAIMS (Update Status)
@app.put("/claims/{claim_id}/status", response_model=ClaimResponse)
def update_claim_status(
    claim_id: int,
    claim_update: ClaimUpdate,
    current_user: User = Depends(require_role("insurance")),
    db: Session = Depends(get_db)
):
    db_claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not db_claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    
    db_claim.status = claim_update.status
    db.commit()
    db.refresh(db_claim)
    return db_claim


# 🔹 Health check
@app.get("/health")
def health():
    return {"status": "ok"}