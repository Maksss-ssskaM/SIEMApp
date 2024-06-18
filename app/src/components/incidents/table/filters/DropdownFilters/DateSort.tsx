import React from 'react';
import {DropdownFilter} from "./DropdownFilter";
import {useActions} from "../../../../../hooks/actions";
import {useAppSelector} from "../../../../../hooks/redux";

export const DateSortList = [
    {name: "Сначала новые", sortProperty: "newest_first"},
    {name: "Сначала старые", sortProperty: "oldest_first"},
];

export function DateSort() {
    const { sortByDate } = useActions();
    const {dateSort} = useAppSelector(state => state.filters)

    return (
        <DropdownFilter
            sortList={DateSortList}
            handleFilterChange={sortByDate}
            currentValue={dateSort}
            title="Дата"
        />
    );
}
