export interface IIncident {
    incident_id: string
    key: string
    name: string
    status: string
    type: string
    created_at: string
    severity: string
}

export interface IEvent {
    incident_id: string
    event_id: string
    description: string
    created_at: string
}

export interface ILineGraphData {
    month: string
    incident_count: number
}

export interface  IPieChartData {
    severity: string
    count: number
}