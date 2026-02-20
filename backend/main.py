from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from database import engine
from models import Base, User
from schemas import UserCreate, UserLogin
from auth import hash_password, verify_password, create_access_token
from dependencies import get_db, require_role

app = FastAPI()

Base.metadata.create_all(bind=engine)


# 🔹 REGISTER
@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

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


# 🔹 LOGIN
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

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


# 🔹 CLAIMS (insurance only)
@app.get("/claims")
def get_claims(current_user=Depends(require_role("insurance"))):
    return [{"msg": "Claims data for insurance"}]