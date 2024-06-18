from typing import Optional, Annotated, Any

import jwt
from fastapi import Security, HTTPException, status, Depends
from fastapi.security import HTTPAuthorizationCredentials

from core.config import load_config
from core.security import jwt_bearer

config = load_config()


async def get_current_user(token: HTTPAuthorizationCredentials = Security(jwt_bearer())) -> Optional[dict]:
    try:
        payload = jwt.decode(jwt=token.credentials, key=config.jwt.secret_key, algorithms=[config.jwt.algorithm])
        return payload
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

user_dependency = Annotated[dict, Depends(get_current_user)]