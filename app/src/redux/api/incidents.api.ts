import {createApi} from "@reduxjs/toolkit/query/react";
import {IIncident, ILineGraphData, IPieChartData} from "../../models/models";
import {baseQueryWithReauth} from "./authApi/baseQueryWithReauth";

interface GetIncidentsParams {
    skip?: number;
    limit?: number;
    severity?: string;
    status?: string;
    date_sort?: string;
}

interface IncidentsResponse {
    incidents: IIncident[];
    incidentsCount: number;
}

interface GraphsDataResponse {
    line_chart: ILineGraphData[];
    pie_chart: IPieChartData[];
}

export const incidentsApi = createApi({
    reducerPath: 'incidents/api',
    baseQuery: baseQueryWithReauth,
    endpoints: build => ({
        getIncidents: build.query<IncidentsResponse, GetIncidentsParams>({
            query: ({skip, limit, severity, status, date_sort = 'newest_first'}: GetIncidentsParams) => ({
                url: 'incidents',
                params: {skip, limit, severity, status, date_sort},
            }),
            transformResponse: (response: [IIncident[], number]) => {
                const [incidents, incidentsCount] = response;
                return { incidents, incidentsCount };
            },
        }),
        getIncidentByKeyword: build.query<IIncident[], string>({
            query: (identifier: string) => `incidents/${identifier}`
        }),
        updateIncident: build.mutation<IIncident, {identifier: string, updateData: Partial<IIncident>}>({
            query: ({identifier, updateData}) => ({
                url: `incidents/${identifier}`,
                method: 'PATCH',
                body: updateData
            })
        }),
        getIncidentGraphsData: build.query<GraphsDataResponse, void>({
            query: () => ({
                url: `incidents/graphs`
            }),
            transformResponse: (response: GraphsDataResponse) => {
                return {
                    line_chart: response.line_chart,
                    pie_chart: response.pie_chart
                };
            },
        }),
    }),
});

export const {useGetIncidentsQuery, useGetIncidentGraphsDataQuery, useGetIncidentByKeywordQuery, useUpdateIncidentMutation} = incidentsApi