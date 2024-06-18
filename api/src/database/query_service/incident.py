from datetime import datetime, timedelta
from typing import Sequence, Optional, Union, Tuple
from uuid import UUID

from sqlalchemy import select, desc, asc, or_, update
from sqlalchemy.ext.asyncio import AsyncSession
from database.models import Incident, IncidentSeverity, IncidentStatus
from sqlalchemy import func


async def get_incidents(
        db: AsyncSession,
        skip: int,
        limit: int,
        severity: Optional[str] = None,
        status: Optional[str] = None,
        date_sort: Optional[str] = None
) -> Tuple[Sequence[Incident], int]:
    sorting = asc(Incident.created_at) if date_sort == 'oldest_first' else desc(Incident.created_at)

    base_query = select(Incident)

    if severity:
        severity_filters = {
            'High': Incident.severity == IncidentSeverity.High,
            'Medium': Incident.severity == IncidentSeverity.Medium,
            'Low': Incident.severity == IncidentSeverity.Low,
        }
        base_query = base_query.filter(severity_filters.get(severity, True))

    if status:
        status_filters = {
            'New': Incident.status == IncidentStatus.New,
            'Approved': Incident.status == IncidentStatus.Approved,
            'In_progress': Incident.status == IncidentStatus.InProgress,
            'Resolved': Incident.status == IncidentStatus.Resolved,
            'Closed': Incident.status == IncidentStatus.Closed,
        }
        base_query = base_query.filter(status_filters.get(status, True))

    incidents_query = base_query.offset(skip).limit(limit).order_by(sorting)

    count_query = select(func.count()).select_from(base_query.subquery())

    incidents_result, count_result = await db.execute(incidents_query), await db.execute(count_query)
    incidents = incidents_result.scalars().all()
    incidents_count = count_result.scalar_one()

    return incidents, incidents_count


async def get_incident_graphs_data(db: AsyncSession):
    now = datetime.utcnow()
    end_date = datetime(now.year, now.month, now.day, 23, 59, 59)
    start_date = end_date - timedelta(days=180)

    line_chart_query = (
        select(
            func.to_char(Incident.created_at, 'YYYY-MM').label('month'),
            func.count().label('incident_count')
        )
        .where(Incident.created_at >= start_date)
        .where(Incident.created_at <= end_date)
        .group_by('month')
        .order_by('month')
    )

    pie_chart_query = (
        select(
            Incident.severity,
            func.count().label('count')
        )
        .group_by(Incident.severity)
    )

    line_chart_result = await db.execute(line_chart_query)
    pie_chart_result = await db.execute(pie_chart_query)

    line_chart_data = line_chart_result.all()
    pie_chart_data = pie_chart_result.all()

    return {
        "line_chart": line_chart_data,
        "pie_chart": pie_chart_data
    }


async def get_incidents_by_keyword(db: AsyncSession, identifier: Union[UUID, str]) -> Sequence[Incident]:
    if isinstance(identifier, UUID):
        query = select(Incident).where(Incident.incident_id == identifier)
    else:
        try:
            uuid_identifier = UUID(identifier)
            query = select(Incident).where(Incident.incident_id == uuid_identifier)
        except:
            identifier_pattern = f"%{identifier.lower()}%"
            query = select(Incident).where(
                or_(
                    func.lower(Incident.key).like(identifier_pattern),
                    func.lower(Incident.name).like(identifier_pattern),
                    func.lower(Incident.type).like(identifier_pattern)
                )
            )

    result = await db.execute(query)
    incidents = result.scalars().all()
    return incidents


async def update_incident_by_identifier(db: AsyncSession, identifier: Union[UUID, str], incident_update):
    query = update(Incident).where(Incident.incident_id == identifier).values(**incident_update)
    result = await db.execute(query)
    await db.commit()

    if result.rowcount == 0:
        return None

    result = await db.execute(select(Incident).where(Incident.incident_id == identifier))
    updated_incident = result.scalar_one()
    await db.refresh(updated_incident)
    return updated_incident

