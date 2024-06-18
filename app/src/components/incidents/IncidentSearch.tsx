import {useEffect, useState} from "react";
import {IncidentModalWindow} from "./IncidentModalWindow";
import {useDebounce} from "../../hooks/debounce";
import {IIncident} from "../../models/models";
import {useGetIncidentByKeywordQuery} from "../../redux/api/incidents.api";
import "../../styles/components/incidents/IncidentSearch.scss"

export function IncidentSearch() {
    const [search, setSearch] = useState('')
    const [dropdown, setDropdown] = useState(false)
    const debouncedSearch = useDebounce(search)
    const [selectedIncident, setSelectedIncident] = useState<IIncident | null>(null);

    const { isLoading, isError, data: incidents } = useGetIncidentByKeywordQuery(debouncedSearch, {
        skip: debouncedSearch.length < 3,
    });

    const handleRowClick = (incident: IIncident) => {
        setSelectedIncident(incident);
        setDropdown(false)
    };

    const closeModal = () => {
        setSelectedIncident(null);
    };

    useEffect(() => {
        setDropdown(debouncedSearch.length >= 3 && incidents?.length! > 0)
    }, [debouncedSearch, incidents])

    return (
        <>
            <div className="incident-search-block">
                <h2 className="incident-search-block__header">Поиск инцидентов</h2>
                <input
                    type="text"
                    className="incident-search-block__input"
                    placeholder="Укажите id, ключ, имя или тип инцидента"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                {dropdown && <ul className='incident-search-block__dropdown'>
                    {isLoading && <p className='loading-message'>Loading...</p>}
                    {incidents?.map(incident => (
                        <li
                            key={incident.incident_id} className="list-item"
                            onClick={() => handleRowClick(incident)}
                        >
                            {incident.key} ({incident.name})
                        </li>
                    ))}
                </ul>}
            </div>
            {selectedIncident && (
                <IncidentModalWindow closeModal={closeModal} selectedIncident={selectedIncident}/>
            )}
        </>
    );
}