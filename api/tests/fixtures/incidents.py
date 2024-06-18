from uuid import uuid4

import factory
from datetime import datetime
from factory_boy_extra.async_sqlalchemy_factory import AsyncSQLAlchemyModelFactory
from database.models import Incident, IncidentStatus, IncidentSeverity


class IncidentFactory(AsyncSQLAlchemyModelFactory):
    class Meta:
        model = Incident

    incident_id = factory.LazyFunction(uuid4)
    key = factory.Sequence(lambda n: f'INC{n:05d}')
    name = factory.Faker('sentence', nb_words=6)
    status = factory.Iterator(IncidentStatus)
    type = factory.Iterator(['Network', 'Application', 'System'])
    created_at = factory.LazyFunction(datetime.now)
    severity = factory.Iterator(IncidentSeverity)
