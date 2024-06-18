from typing import Sequence
from uuid import UUID
from fastapi import APIRouter, HTTPException

from dependencies import db_dependency, user_dependency
from database import event_service
from schemas import EventSchema

router = APIRouter(prefix='/events', tags=['events'])


@router.get(path='', response_model=Sequence[EventSchema])
async def get_events_by_incident_id(db: db_dependency, _: user_dependency, incident_id: UUID):
    events = await event_service.get_events_by_incident_id(db=db, incident_id=incident_id)
    if events is None:
        raise HTTPException(status_code=404, detail='События не найдены')
    return events
