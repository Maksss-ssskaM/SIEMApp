from typing import Sequence

from pydantic import BaseModel


class LineGraphData(BaseModel):
    month: str
    incident_count: int


class PieChartData(BaseModel):
    severity: str
    count: int


class GraphsDataResponse(BaseModel):
    line_chart: Sequence[LineGraphData]
    pie_chart: Sequence[PieChartData]