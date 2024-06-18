import {useState, useEffect} from "react";
import {StatusFilter} from "../filters/DropdownFilters/StatusFilter";
import {SeverityFilter} from "../filters/DropdownFilters/SeverityFilter";
import {DateSort} from "../filters/DropdownFilters/DateSort";
import {IncidentCountFilter} from "../filters/IncidentCountFilter";
import {IncidentModalWindow} from "../../IncidentModalWindow";
import {LinkButton} from "../../LinkButton";
import {IIncident} from "../../../../models/models";
import {formatIncidentDate} from "../../../../utils/utils";

interface IncidentsListProps {
    incidents: IIncident[] | undefined;
    refreshIncidentsList: () => void;
}

export const IncidentList = ({incidents, refreshIncidentsList}: IncidentsListProps) => {
    const [selectedIncident, setSelectedIncident] = useState<IIncident | null>(null);

    const handleRowClick = (incident: IIncident) => {
        setSelectedIncident(incident);
    };

    const closeModal = () => {
        setSelectedIncident(null);
        refreshIncidentsList();
    };

    return (
        <>
            <table className="incidents-table">
                <thead>
                <tr>
                    <th>Инцидент</th>
                    <th><StatusFilter/></th>
                    <th>Тип</th>
                    <th><SeverityFilter/></th>
                    <th><DateSort/></th>
                    <th><IncidentCountFilter/></th>
                </tr>
                </thead>
                <tbody>
                {incidents?.map(incident => (
                    <tr key={incident.incident_id} onClick={() => handleRowClick(incident)}>
                        <td>{incident.key} ({incident.name})</td>
                        <td>{incident.status}</td>
                        <td>{incident.type}</td>
                        <td>{incident.severity}</td>
                        <td>{formatIncidentDate(incident.created_at)}</td>
                        <td>
                            <LinkButton incident_id={incident.incident_id}/>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {selectedIncident && (
                <IncidentModalWindow closeModal={closeModal} selectedIncident={selectedIncident}/>
            )}
        </>
    );
};