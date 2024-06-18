import "../styles/pages/IncidentPage.scss"
import {IncidentTable} from "../components/incidents/table/IncidentTable";
import {IncidentSearch} from "../components/incidents/IncidentSearch";
import {Graphs} from "../components/incidents/Graphs";

export function IncidentPage() {
    return (
        <div className="incidents-page">
            <h1 className="incidents-page__header">Таблица инцидентов</h1>
            <div className="incidents-page__content">
                <div className="incidents-table-container">
                    <IncidentTable/>
                </div>
                <div className="graphs-container">
                    <IncidentSearch/>
                    <Graphs/>
                </div>
            </div>
        </div>
    );
}