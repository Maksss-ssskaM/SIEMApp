import {createSlice, PayloadAction} from "@reduxjs/toolkit";


export interface FiltersState {
    limit: number
    severity: string | undefined
    status: string | undefined
    dateSort: string | undefined
}

const initialState: FiltersState = {
    limit: 15,
    severity: undefined,
    status: undefined,
    dateSort: "newest_first"
}

export const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        filterIncidentsCount(state, action: PayloadAction<number>) {
            state.limit = action.payload
        },
        filterSeverity(state, action: PayloadAction<string | undefined>) {
            state.severity = action.payload
        },
        filterStatus(state, action: PayloadAction<string | undefined>) {
            state.status = action.payload
        },
        sortByDate(state, action: PayloadAction<string | undefined>) {
            state.dateSort = action.payload
        }
    },
})

export const filtersActions = filtersSlice.actions
export const filtersReducer = filtersSlice.reducer