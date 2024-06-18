import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface AuthState {
    isLoggedIn: boolean;
    accessToken: string | null;
    refreshToken: string | null;
}

const initialState: AuthState = {
    isLoggedIn: Boolean(localStorage.getItem('access_token')),
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token')
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken(state, action: PayloadAction<string>) {
            state.accessToken = action.payload
            state.isLoggedIn = true
            localStorage.setItem('access_token', action.payload)
        },
        setRefreshToken(state, action: PayloadAction<string>) {
            state.refreshToken = action.payload
            localStorage.setItem('refresh_token', action.payload)
        },
        clearToken(state) {
            state.accessToken = null
            state.refreshToken = null
            state.isLoggedIn = false
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
        }
    }
})

export const authActions = authSlice.actions
export const authReducer = authSlice.reducer