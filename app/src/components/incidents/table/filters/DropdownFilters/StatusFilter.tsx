import React from 'react';
import {DropdownFilter} from "./DropdownFilter";
import {useActions} from "../../../../../hooks/actions";
import {useAppSelector} from "../../../../../hooks/redux";

export const statusFilterList = [
    {name: 'По умолчанию', sortProperty: undefined},
    {name: 'Новый', sortProperty: "New"},
    {name: 'Утверждён', sortProperty: "Approved"},
    {name: 'В работе', sortProperty: "In_progress"},
    {name: 'Разрешён', sortProperty: "Resolved"},
    {name: 'Закрыт', sortProperty: "Closed"},
];

export function StatusFilter() {
    const {filterStatus} = useActions();
    const {status} = useAppSelector(state => state.filters)

    return (
        <DropdownFilter
            sortList={statusFilterList}
            handleFilterChange={filterStatus}
            currentValue={status}
            title="Статус"
        />
    );
}
