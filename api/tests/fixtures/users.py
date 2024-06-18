import factory
from datetime import datetime
from factory_boy_extra.async_sqlalchemy_factory import AsyncSQLAlchemyModelFactory
from database.models import User


class UserFactory(AsyncSQLAlchemyModelFactory):
    class Meta:
        model = User

    user_id = factory.Sequence(lambda n: n + 1)
    username = factory.Faker('user_name')
    created_at = factory.LazyFunction(datetime.now)
    password = factory.Faker('password', length=12)
