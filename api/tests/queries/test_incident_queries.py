from datetime import datetime, timedelta

import pytest
from sqlalchemy.ext.asyncio import AsyncSession
from database.query_service.incident import get_incidents, get_incidents_by_keyword, get_incident_graphs_data, \
    update_incident_by_identifier
from fixtures.incidents import IncidentFactory


@pytest.mark.asyncio
async def test_get_incidents(sa_session: AsyncSession):
    for _ in range(10):
        incident = IncidentFactory.build()
        sa_session.add(incident)
    await sa_session.commit()

    incidents, count = await get_incidents(
        db=sa_session, skip=0, limit=5
    )
    assert incidents
    assert len(incidents) == 5
    assert count == 10


@pytest.mark.asyncio
async def test_get_incidents_by_severity(sa_session: AsyncSession):

    for _ in range(4):
        incident = IncidentFactory.build()
        incident.severity = 'High'
        sa_session.add(incident)

    for _ in range(6):
        incident = IncidentFactory.build()
        incident.severity = 'Low'
        sa_session.add(incident)
    await sa_session.commit()

    incidents, _ = await get_incidents(
        db=sa_session, skip=0, limit=10, severity='High'
    )

    assert incidents
    assert len(incidents) == 4

    incidents, _ = await get_incidents(
        db=sa_session, skip=0, limit=10, severity='Low'
    )

    assert incidents
    assert len(incidents) == 6


@pytest.mark.asyncio
async def test_get_incidents_by_status(sa_session: AsyncSession):

    for _ in range(4):
        incident = IncidentFactory.build()
        incident.status = 'New'
        sa_session.add(incident)

    for _ in range(6):
        incident = IncidentFactory.build()
        incident.status = 'Approved'
        sa_session.add(incident)
    await sa_session.commit()

    incidents, _ = await get_incidents(
        db=sa_session, skip=0, limit=10, status='New'
    )

    assert incidents
    assert len(incidents) == 4

    incidents, _ = await get_incidents(
        db=sa_session, skip=0, limit=10, status='Approved'
    )

    assert incidents
    assert len(incidents) == 6


@pytest.mark.asyncio
async def test_get_incidents_by_sorting(sa_session: AsyncSession):
    for i in range(5):
        incident = IncidentFactory.build(created_at=datetime.utcnow() - timedelta(days=i))
        sa_session.add(incident)
    await sa_session.commit()

    incidents, _ = await get_incidents(
        db=sa_session, skip=0, limit=5, date_sort='newest_first'
    )

    assert incidents
    assert incidents[0].created_at > incidents[2].created_at > incidents[-1].created_at
    assert len(incidents) == 5

    incidents, _ = await get_incidents(
        db=sa_session, skip=0, limit=5, date_sort='oldest_first'
    )

    assert incidents
    assert incidents[0].created_at < incidents[2].created_at < incidents[-1].created_at
    assert len(incidents) == 5


@pytest.mark.asyncio
async def test_get_incident_by_identifier(sa_session: AsyncSession):
    incident = IncidentFactory.build(name='INC-1234')
    sa_session.add(incident)
    await sa_session.commit()

    fetched_incident = await get_incidents_by_keyword(db=sa_session, identifier='1235')

    assert not fetched_incident

    fetched_incident = await get_incidents_by_keyword(db=sa_session, identifier='1234')

    assert len(fetched_incident) == 1
    assert fetched_incident[0].incident_id == incident.incident_id


@pytest.mark.asyncio
async def test_get_incident_graphs_data(sa_session: AsyncSession):
    current_time = datetime.utcnow()
    for i in range(6):
        month_shift = timedelta(days=i * 30)
        for j in range(10):
            incident_date = current_time - month_shift
            severity = 'High' if j % 2 == 0 else 'Low'
            incident = IncidentFactory.build(created_at=incident_date, severity=severity)
            sa_session.add(incident)
    await sa_session.commit()

    graphs_data = await get_incident_graphs_data(db=sa_session)

    assert 'line_chart' in graphs_data
    assert 'pie_chart' in graphs_data
    assert len(graphs_data['line_chart']) == 6
    assert len(graphs_data['pie_chart']) == 2


@pytest.mark.asyncio
async def test_update_incident(sa_session: AsyncSession):
    incident = IncidentFactory.build(name="Original Name")
    sa_session.add(incident)
    await sa_session.commit()

    updated_incident = await update_incident_by_identifier(
        db=sa_session,
        identifier=incident.incident_id,
        incident_update={'name': "Updated Name"}
    )

    assert updated_incident is not None
    assert updated_incident.name == "Updated Name"