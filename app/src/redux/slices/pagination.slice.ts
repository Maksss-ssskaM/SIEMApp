import {createSlice} from "@reduxjs/toolkit";

export interface PaginationState {
    currentPage: number
}

const initialState: PaginationState = {
    currentPage: JSON.parse(localStorage.getItem("current_page") ?? '1'),
}

export const paginationSlice = createSlice({
    name: 'pagination',
    initialState,
    reducers: {
        goToPreviousPage(state) {
            state.currentPage -= 1
            localStorage.setItem("current_page", JSON.stringify(state.currentPage))
        },
        goToNextPage(state) {
            state.currentPage += 1
            localStorage.setItem("current_page", JSON.stringify(state.currentPage))
        },
        goToFirstPage(state) {
            state.currentPage = 1
            localStorage.setItem("current_page", JSON.stringify(state.currentPage))
        }
    },
})

export const paginationActions = paginationSlice.actions
export const paginationReducer = paginationSlice.reducer