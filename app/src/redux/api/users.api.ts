import {createApi} from "@reduxjs/toolkit/query/react";
import {baseQueryWithReauth} from "./authApi/baseQueryWithReauth";

interface ChangePasswordRequest {
    old_password: string;
    new_password: string;
}

interface UserResponse {
    user_id: number,
    username: string,
    created_at: string
}

export const usersApi = createApi({
    reducerPath: 'users/api',
    baseQuery: baseQueryWithReauth,
    endpoints: build => ({
        getUserInfo: build.query<UserResponse, void>({
           query: () => ({
               url: 'user/info'

           })
        }),
        changePassword: build.mutation<null, ChangePasswordRequest>({
            query: (body) => ({
                url: 'user/change-password',
                method: 'PATCH',
                body
            })
        })
    })
})

export const {useGetUserInfoQuery, useChangePasswordMutation} = usersApi