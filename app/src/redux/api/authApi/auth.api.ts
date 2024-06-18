import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";


interface LoginRequest {
    username: string;
    password: string;
}

interface LoginResponse {
    access_token: string;
    refresh_token: string;
}
export const authApi = createApi({
    reducerPath: 'auth/api',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_API_BASE_URL}/`
    }),
    endpoints: build => ({
        loginUser: build.mutation<LoginResponse, LoginRequest>({
            query: (body) => ({
                url: 'auth',
                method: 'POST',
                body
            }),
        }),
    }),
});

export const {useLoginUserMutation} = authApi