from datetime import datetime
from typing import Optional

from pydantic import BaseModel, UUID4
from database.models import IncidentStatus, IncidentSeverity


class IncidentSchema(BaseModel):
    incident_id: UUID4 | str
    key: str
    name: str
    status: IncidentStatus | str
    type: str
    created_at: datetime | str
    severity: IncidentSeverity | str

    class Config:
        from_attributes = True
        json_schema_extra = {
            'example': {
                'incident_id': '32b17948-5755-4905-b0f3-17db2402259b',
                'key': 'INC-752',
                'name': 'Example Incident',
                'status': IncidentStatus.New,
                'type': 'Spam',
                'created_at': '2023-12-30 02:15:45.000000',
                'severity': IncidentSeverity.High
            }
        }


class IncidentUpdateSchema(BaseModel):
    name: Optional[str] = None
    status: Optional[IncidentStatus] = None
    severity: Optional[IncidentSeverity] = None
