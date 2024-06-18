import {createApi} from "@reduxjs/toolkit/query/react";
import {IEvent} from "../../models/models";
import {baseQueryWithReauth} from "./authApi/baseQueryWithReauth";


export const eventsApi = createApi({
    reducerPath: 'events/api',
    baseQuery: baseQueryWithReauth,
    endpoints: build => ({
        getEvents: build.query<IEvent[], string>({
            query: (incident_id: string) => ({
                url: 'events',
                params: {incident_id},
            }),
        }),
    }),
});

export const {useGetEventsQuery} = eventsApi