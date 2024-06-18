import "../../styles/components/incidents/LinkButton.scss"
import React from "react";

interface LinkButtonProps{
    incident_id: string
}

export const LinkButton = ({incident_id}: LinkButtonProps) => {
    const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        window.location.href = `${process.env.REACT_APP_SIEM_BASE_URL}/#/incident/incidents/view/${incident_id}`;
    };

    return(
        <button
            className='link-button'
            onClick={handleClick}>
            Ссылка
        </button>
    )
}