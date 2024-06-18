from datetime import datetime
from pydantic import BaseModel, UUID4


class EventSchema(BaseModel):
    incident_id: UUID4
    event_id: UUID4
    description: str
    created_at: datetime

    class Config:
        from_attributes = True
        json_schema_extra = {
            'example': {
                'incident_id': '32b17948-5755-4905-b0f3-17db2402259b',
                'event_id': '32b17948-5755-4905-b0f3-17db240225a1',
                'description': 'Анализ сетевой активности выявил подозрительные запросы с узла 10.2.20.5. Произведена блокировка узла',
                'created_at': '2023-12-30 02:15:45.000000'
            }
        }


