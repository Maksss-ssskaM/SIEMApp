from pydantic import BaseModel


class LoginSchema(BaseModel):
    username: str
    password: str

    class Config:
        json_schema_extra = {
            'example': {
                'username': 'UsernameExample',
                'password': '12345678'
            }
        }


class AuthTokensResponse(BaseModel):
    access_token: str
    refresh_token: str

    class Config:
        json_schema_extra = {
            'example': {
                'access_token': 'access_token_example',
                'refresh_token': 'refresh_token_example'
            }
        }


class RefreshTokenSchema(BaseModel):
    refresh_token: str

    class Config:
        json_schema_extra = {
            'example': {
                'refresh_token': 'refresh_token_example'
            }
        }


class RefreshedTokenResponse(BaseModel):
    access_token: str

    class Config:
        json_schema_extra = {
            'example': {
                'access_token': 'new_access_token_example'
            }
        }
