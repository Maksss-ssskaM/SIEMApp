from datetime import datetime, timedelta

import jwt
from argon2 import PasswordHasher
from fastapi import HTTPException, status
from fastapi.security import HTTPBearer
from jwt import ExpiredSignatureError

from core.config import load_config

password_hasher = PasswordHasher()
config = load_config()


def check_password(password: str, hashed_password: str) -> bool:
    try:
        return password_hasher.verify(password=password, hash=hashed_password)
    except:
        return False


def create_access_token(data: dict) -> str:
    access_token_data = data.copy()
    access_token_data.update({'exp': datetime.utcnow() + timedelta(hours=config.jwt.access_token_expire_hours)})
    access_token = jwt.encode(payload=access_token_data, key=config.jwt.secret_key, algorithm=config.jwt.algorithm)
    return access_token


def create_refresh_token(data: dict) -> str:
    refresh_token_data = data.copy()
    refresh_token_data.update({'exp': datetime.utcnow() + timedelta(hours=config.jwt.refresh_token_expire_hours)})
    refresh_token = jwt.encode(payload=refresh_token_data, key=config.jwt.secret_key, algorithm=config.jwt.algorithm)
    return refresh_token


def refresh_access_token(token: str) -> str:
    try:
        decoded_token = jwt.decode(jwt=token, key=config.jwt.secret_key, algorithms=[config.jwt.algorithm])
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token истёк."
        )

    user_id = decoded_token.get("sub")

    return create_access_token(data={"sub": user_id})


def jwt_bearer():
    return HTTPBearer()
