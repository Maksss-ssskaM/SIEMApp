import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from fixtures.events import EventFactory
from database.query_service.event import get_events_by_incident_id
from fixtures.incidents import IncidentFactory


@pytest.mark.asyncio
async def test_get_events_by_incident_id(sa_session: AsyncSession):
    incident = IncidentFactory.build()
    sa_session.add(incident)
    await sa_session.commit()

    for _ in range(5):
        event = EventFactory.build(incident_id=incident.incident_id)
        sa_session.add(event)
    await sa_session.commit()

    events = await get_events_by_incident_id(db=sa_session, incident_id=incident.incident_id)
    assert len(events) == 5
    assert all(event.incident_id == incident.incident_id for event in events)