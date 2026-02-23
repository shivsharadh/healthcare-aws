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


# 🏥 CLAIMS
class ClaimCreate(BaseModel):
    patient_name: str
    diagnosis: str
    amount: int

class ClaimUpdate(BaseModel):
    status: str

class ClaimResponse(BaseModel):
    id: int
    patient_name: str
    diagnosis: str
    amount: int
    status: str
    submitted_by: str

    class Config:
        from_attributes = True