from pydantic import BaseModel


# 🔐 AUTH
class UserCreate(BaseModel):
    username: str
    password: str
    role: str


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


# 🏥 CLAIM RESPONSE
class ClaimResponse(BaseModel):
    claim_id: int
    patient_name: str
    diagnosis: str
    amount: int

    class Config:
        from_attributes = True