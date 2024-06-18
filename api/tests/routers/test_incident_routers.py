from datetime import datetime, timedelta

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from fixtures.incidents import IncidentFactory


@pytest.mark.asyncio
async def test_get_incidents(auth_http_client, sa_session: AsyncSession):
    for _ in range(10):
        incident = IncidentFactory.build()
        sa_session.add(incident)
    await sa_session.commit()

    response = await auth_http_client.get("/incidents")
    assert response.status_code == 200

    incidents, incidents_count = response.json()
    assert len(incidents) == 10
    assert incidents_count == 10


@pytest.mark.asyncio
async def test_get_incident_by_keyword(auth_http_client, sa_session: AsyncSession):
    incident = IncidentFactory.build(name='INC-1234')
    sa_session.add(incident)
    await sa_session.commit()

    response = await auth_http_client.get(f"/incidents/1234")
    assert response.status_code == 200

    incidents = response.json()
    assert len(incidents) == 1
    assert incidents[0]['incident_id'] == str(incident.incident_id)


@pytest.mark.asyncio
async def test_update_incident(auth_http_client, sa_session: AsyncSession):
    incident = IncidentFactory.build()
    sa_session.add(incident)
    await sa_session.commit()

    response = await auth_http_client.patch(f"/incidents/{incident.incident_id}", json={"name": "New name"})
    assert response.status_code == 200

    updated_incident = response.json()
    assert updated_incident['name'] == "New name"


@pytest.mark.asyncio
async def test_get_graphs_data(auth_http_client, sa_session: AsyncSession):
    current_time = datetime.utcnow()
    for i in range(6):
        month_shift = timedelta(days=i * 30)
        for j in range(10):
            incident_date = current_time - month_shift
            severity = 'High' if j % 2 == 0 else 'Low'
            incident = IncidentFactory.build(created_at=incident_date, severity=severity)
            sa_session.add(incident)
    await sa_session.commit()

    response = await auth_http_client.get("/incidents/graphs")
    assert response.status_code == 200

    graphs_data = response.json()

    assert len(graphs_data['line_chart']) == 6
    assert len(graphs_data['pie_chart']) == 2
