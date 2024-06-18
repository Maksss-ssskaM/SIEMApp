from fastapi import APIRouter, HTTPException
from starlette import status

from core.security import check_password
from dependencies import db_dependency, user_dependency
from database import user_service
from schemas import PasswordChangeSchema, UserDataResponse

router = APIRouter(prefix='/user', tags=['user'])


@router.get(path='/info', response_model=UserDataResponse)
async def user_info(db: db_dependency, current_user: user_dependency) -> UserDataResponse:
    user = await user_service.get_user_by_id(db=db, user_id=current_user.get("sub"))

    return UserDataResponse(
        user_id=user.user_id,
        username=user.username,
        created_at=user.created_at
    )


@router.patch(path='/change-password', response_model=None)
async def change_password(password_change_data: PasswordChangeSchema, db: db_dependency, current_user: user_dependency):
    user = await user_service.get_user_by_id(db=db, user_id=current_user.get("sub"))

    if user is None or not check_password(password=password_change_data.old_password, hashed_password=user.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Некорректный пароль')

    await user_service.update_password(db=db, user_id=user.user_id, new_password=password_change_data.new_password)
