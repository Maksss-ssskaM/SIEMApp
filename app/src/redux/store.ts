import {configureStore} from "@reduxjs/toolkit";
import {incidentsApi} from "./api/incidents.api";
import {eventsApi} from "./api/events.api";
import {authApi} from "./api/authApi/auth.api";
import {usersApi} from "./api/users.api";
import {filtersReducer} from "./slices/filters.slice";
import {paginationReducer} from "./slices/pagination.slice";
import {authReducer} from "./slices/auth.slice";

export const store = configureStore({
    reducer: {
        [incidentsApi.reducerPath]: incidentsApi.reducer,
        [eventsApi.reducerPath]: eventsApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        filters: filtersReducer,
        pagination: paginationReducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(incidentsApi.middleware)
            .concat(eventsApi.middleware)
            .concat(authApi.middleware)
            .concat(usersApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>