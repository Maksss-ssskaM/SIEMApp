from dataclasses import dataclass

from environs import Env


@dataclass
class DatabaseConfig:
    db_user: str
    db_pass: str
    db_host: str
    db_name: str
    db_port: str


@dataclass
class JWTConfig:
    access_token_expire_hours: int
    refresh_token_expire_hours: int
    secret_key: str
    algorithm: str = 'HS256'


@dataclass
class Config:
    db: DatabaseConfig
    jwt: JWTConfig


def load_config():
    env = Env()
    env.read_env()
    return Config(
        db=DatabaseConfig(
            db_user=env('DB_USER'),
            db_pass=env('DB_PASS'),
            db_host=env('DB_HOST'),
            db_name=env('DB_NAME'),
            db_port=env('DB_PORT')
        ),
        jwt=JWTConfig(
            access_token_expire_hours=env.int('ACCESS_TOKEN_EXPIRE_HOURS'),
            refresh_token_expire_hours=env.int('REFRESH_TOKEN_EXPIRE_HOURS'),
            algorithm=env('ALGORITHM'),
            secret_key=env('SECRET_KEY')
        )
    )