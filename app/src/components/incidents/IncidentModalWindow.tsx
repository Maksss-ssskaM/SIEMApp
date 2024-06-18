import React, {useState} from 'react';
import {LinkButton} from "./LinkButton";
import {EventList} from "./EventList";
import {IIncident} from "../../models/models";
import {formatIncidentDate} from "../../utils/utils";
import "../../styles/components/incidents/IncidentModalWindow.scss"
import {IncidentEditor} from "./IncidentEditor";

interface IncidentModalWindowProps {
    closeModal: () => void;
    selectedIncident: IIncident;
}

export function IncidentModalWindow({closeModal, selectedIncident}: IncidentModalWindowProps) {
    const [incident, setIncident] = useState(selectedIncident)
    const statusOptions = ["Новый", "Утверждён", "В работе", "Разрешён", "Закрыт"];
    const severityOptions = ["Высокий 🔴", "Средний 🟠", "Низкий 🟡"];

    const handleUpdate = (attribute: string, value: string) => {
        setIncident(prev => ({ ...prev, [attribute]: value }));
    };

    return (
        <div className="modal">
            <div className="modal__content" onClick={e => e.stopPropagation()}>
                <span className="modal__close" onClick={closeModal}>&times;</span>
                <div className="modal__title-container">
                    <h2 className="modal__title">{incident.key} ({incident.name})</h2>
                    <IncidentEditor
                        incidentId={incident.incident_id}
                        title="Имя инцидента"
                        attribute="name"
                        value={incident.name}
                        type="text"
                        onUpdate={handleUpdate}
                    />
                    <LinkButton incident_id={incident.incident_id}/>
                </div>
                <div className="modal__details">
                    <div className="detail-row">
                        <p>
                            <span>Статус:</span> {incident.status}
                        </p>
                        <IncidentEditor
                            incidentId={incident.incident_id}
                            title="Статус"
                            attribute="status"
                            value={incident.status}
                            options={statusOptions}
                            type="select"
                            onUpdate={handleUpdate}
                        />
                    </div>
                    <p>
                        <span>Тип:</span> {incident.type}
                    </p>
                    <div className="detail-row">
                        <p>
                            <span>Уровень угрозы:</span> {incident.severity}
                        </p>
                        <IncidentEditor
                            incidentId={incident.incident_id}
                            title="Уровень угрозы"
                            attribute="severity"
                            value={incident.severity}
                            options={severityOptions}
                            type="select"
                            onUpdate={handleUpdate}
                        />
                    </div>
                    <p>
                        <span>Дата:</span> {formatIncidentDate(incident.created_at)}
                    </p>
                </div>
                <div className="modal__events-title-container">
                    <h2 className="modal__events-title">События</h2>
                    <div className="modal__horizontal-line"></div>
                </div>
                <EventList incident_id={incident.incident_id}/>
            </div>
        </div>
    );
}
