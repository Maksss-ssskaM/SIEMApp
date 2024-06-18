from uuid import UUID

from fastapi import APIRouter, HTTPException
from typing import Optional, Union, Sequence, Tuple

from dependencies import db_dependency, user_dependency
from database import incident_service
from schemas import GraphsDataResponse, IncidentSchema, IncidentUpdateSchema
from websocket_manager import send_to_websockets

router = APIRouter(prefix='/incidents', tags=['incidents'])


@router.get('', response_model=Tuple[Sequence[IncidentSchema], int])
async def get_incidents(
        db: db_dependency,
        _: user_dependency,
        skip: int = 0,
        limit: int = 10,
        severity: Optional[str] = None,
        status: Optional[str] = None,
        date_sort: Optional[str] = 'newest_first',
):
    incidents, incidents_count = await incident_service.get_incidents(
        db=db, skip=skip, limit=limit, severity=severity, status=status, date_sort=date_sort
    )
    return incidents, incidents_count


@router.get(path='/graphs', response_model=GraphsDataResponse)
async def get_graphs_data(db: db_dependency, _: user_dependency):
    graphs_data = await incident_service.get_incident_graphs_data(db=db)
    return graphs_data


@router.get("/{identifier}", response_model=Sequence[IncidentSchema])
async def get_incident_by_keyword(db: db_dependency, _: user_dependency, identifier: Union[UUID, str]):
    incidents = await incident_service.get_incidents_by_keyword(db=db, identifier=identifier)
    if incidents is None:
        raise HTTPException(status_code=404, detail='Инцидент не найден')
    return incidents


@router.patch("/{identifier}", response_model=IncidentSchema)
async def update_incident(
        db: db_dependency,
        _: user_dependency,
        identifier: Union[UUID, str],
        incident_update: IncidentUpdateSchema
):
    updated_incident = await incident_service.update_incident_by_identifier(
        identifier=identifier,
        incident_update=incident_update.model_dump(exclude_unset=True),
        db=db
    )
    if updated_incident is None:
        raise HTTPException(status_code=404, detail="Инцидент не найден")
    return updated_incident


@router.post("/submit-new-incidents", response_model=None)
async def submit_new_incidents(incidents: Sequence[IncidentSchema]):
    sorted_incidents = sorted(incidents, key=lambda incident: incident.created_at, reverse=True)
    await send_to_websockets(data=[incident.model_dump() for incident in sorted_incidents], category="new_incidents")
