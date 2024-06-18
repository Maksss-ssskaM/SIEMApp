from uuid import uuid4

import factory
from datetime import datetime
from factory_boy_extra.async_sqlalchemy_factory import AsyncSQLAlchemyModelFactory
from database.models import Event
from fixtures.incidents import IncidentFactory


class EventFactory(AsyncSQLAlchemyModelFactory):
    class Meta:
        model = Event

    incident_id = factory.LazyFunction(uuid4)
    event_id = factory.LazyFunction(uuid4)
    created_at = factory.LazyFunction(datetime.now)
    description = factory.Faker('sentence', nb_words=10)