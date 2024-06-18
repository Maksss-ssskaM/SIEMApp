import {bindActionCreators} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {filtersActions} from "../redux/slices/filters.slice";
import {paginationActions} from "../redux/slices/pagination.slice";
import {authActions} from "../redux/slices/auth.slice";


const actions = {
    ...filtersActions,
    ...paginationActions,
    ...authActions
}

export const useActions = () => {
    const dispatch = useDispatch()
    return bindActionCreators(actions, dispatch)
}