import React from 'react';
import { DropdownFilter } from './DropdownFilter';
import {useActions} from "../../../../../hooks/actions";
import {useAppSelector} from "../../../../../hooks/redux";


export const severityFilterList = [
    {name: 'По умолчанию', sortProperty: undefined},
    {name: 'Низкий', sortProperty: "Low"},
    {name: 'Средний', sortProperty: "Medium"},
    {name: 'Высокий', sortProperty: "High"},
];

export function SeverityFilter() {
    const { filterSeverity } = useActions();
    const { severity } = useAppSelector(state => state.filters);

    return (
        <DropdownFilter
            sortList={severityFilterList}
            handleFilterChange={filterSeverity}
            currentValue={severity}
                title="Уровень угрозы"
        />
    );
}