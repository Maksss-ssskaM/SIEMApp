import {BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError} from '@reduxjs/toolkit/query/react';
import {RootState} from "../../store";
import {authActions} from "../../slices/auth.slice";

export const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_API_BASE_URL}/`,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error?.status === 401) {
        const refreshResult = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: (api.getState() as RootState).auth.refreshToken }),
        });

        const refreshData = await refreshResult.json();
        if (refreshResult.ok) {
            api.dispatch(authActions.setAccessToken(refreshData.access_token));
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(authActions.clearToken());
        }
    }
    return result;
};