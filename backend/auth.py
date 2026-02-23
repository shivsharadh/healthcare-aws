from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    # Bcrypt strictly expects <= 72 bytes. Python string slicing isn't byte-safe.
    # Encode to bytes, truncate to 71 bytes to leave room for null terminator, decode back.
    truncated_pass = password.encode('utf-8')[:71].decode('utf-8', 'ignore')
    return pwd_context.hash(truncated_pass)


def verify_password(plain_password: str, hashed_password: str):
    truncated_pass = plain_password.encode('utf-8')[:71].decode('utf-8', 'ignore')
    return pwd_context.verify(truncated_pass, hashed_password)


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)