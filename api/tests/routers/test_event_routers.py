import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from fixtures.events import EventFactory
from fixtures.incidents import IncidentFactory


@pytest.mark.asyncio
async def test_get_events_by_incident_id(auth_http_client, sa_session: AsyncSession):
    incident = IncidentFactory.build()
    sa_session.add(incident)
    await sa_session.commit()

    for _ in range(5):
        event = EventFactory.build(incident_id=incident.incident_id)
        sa_session.add(event)
    await sa_session.commit()

    response = await auth_http_client.get(f"/events?incident_id={incident.incident_id}")
    assert response.status_code == 200

    events = response.json()
    assert len(events) == 5
    print(events)
    assert all(event['incident_id'] == str(incident.incident_id) for event in events)
