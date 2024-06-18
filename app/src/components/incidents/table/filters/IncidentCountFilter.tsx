import React from "react";
import {useActions} from "../../../../hooks/actions";
import {useAppSelector} from "../../../../hooks/redux";
import "../../../../styles/components/incidents/table/filters/IncidentCountFilter.scss"

export function IncidentCountFilter() {
    const {filterIncidentsCount, goToFirstPage} = useActions();
    const {limit} = useAppSelector(state => state.filters);

    const valueMap = [15, 30, 50];

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const index = Number(event.target.value);
        const value = valueMap[index];
        filterIncidentsCount(value);
        goToFirstPage();
    };

    const currentValueIndex = valueMap.indexOf(limit);

    return (
        <div className="slider-container">
            <input type="range" min="0" max={valueMap.length - 1} value={currentValueIndex} onChange={handleSliderChange} />
            <span>{limit}</span>
        </div>
    );
}