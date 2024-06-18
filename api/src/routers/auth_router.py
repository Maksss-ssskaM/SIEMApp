from fastapi import APIRouter, HTTPException
from starlette import status

from core.security import check_password, create_access_token, refresh_access_token, create_refresh_token
from dependencies import db_dependency
from schemas import AuthTokensResponse, LoginSchema, RefreshTokenSchema, RefreshedTokenResponse
from database import user_service

router = APIRouter(prefix='/auth', tags=['auth'])


@router.post(path='', response_model=AuthTokensResponse)
async def login(login_data: LoginSchema, db: db_dependency):
    user = await user_service.get_user_by_username(db=db, username=login_data.username)

    if user is None or not check_password(password=login_data.password, hashed_password=user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Некорректное имя пользователя или пароль')

    return AuthTokensResponse(
        access_token=create_access_token({'sub': user.user_id}),
        refresh_token=create_refresh_token({'sub': user.user_id})
    )


@router.post(path='/refresh', response_model=RefreshedTokenResponse)
async def refresh_token(token_data: RefreshTokenSchema):
    new_access_token = refresh_access_token(token=token_data.refresh_token)
    return RefreshedTokenResponse(
        access_token=new_access_token
    )
