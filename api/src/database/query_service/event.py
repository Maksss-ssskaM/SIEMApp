from typing import Sequence
from pydantic import UUID4
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import Event


async def get_events_by_incident_id(db: AsyncSession, incident_id: UUID4) -> Sequence[Event]:
    query = select(Event).where(Event.incident_id == incident_id)
    result = await db.execute(query)

    return result.scalars().all()


async def get_event_by_id(db: AsyncSession, event_id: UUID4) -> Event:
    query = select(Event).where(Event.event_id == event_id)
    result = await db.execute(query)

    return result.scalar()
