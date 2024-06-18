import {useState, useEffect} from "react";
import {IncidentList} from "./list/IncidentList";
import {Pagination} from "./pagination/Pagination";
import {useAppSelector} from "../../../hooks/redux";
import {useGetIncidentsQuery} from "../../../redux/api/incidents.api";
import "../../../styles/components/incidents/table/IncidentTable.scss";
import {createWebSocketConnection} from "../../../services/websocket";
import {IIncident} from "../../../models/models";


type Mapping = {
    [key: string]: string;
};

const severityMapping: Mapping = {
    Low: "Низкий 🟡",
    Medium: "Средний 🟠",
    High: "Высокий 🔴"
};

const statusMapping: Mapping = {
    New: "Новый",
    Approved: "Утверждён",
    In_progress: "В работе",
    Resolved: "Разрешён",
    Closed: "Закрыт"

};

export function IncidentTable() {
    const {limit, severity, status, dateSort} = useAppSelector(state => state.filters);
    const {currentPage} = useAppSelector(state => state.pagination);

    const {
        isLoading: areIncidentsLoading,
        isError: isIncidentsError,
        data: incidentsResponse,
        refetch
    } = useGetIncidentsQuery({
        skip: (currentPage - 1) * limit,
        limit: limit,
        severity: severity ?? undefined,
        status: status ?? undefined,
        date_sort: dateSort ?? undefined
    });

    const [incidents, setIncidents] = useState<IIncident[]>([]);
    const lastPage = incidentsResponse?.incidentsCount ? Math.ceil(incidentsResponse.incidentsCount / limit) : 0;

    useEffect(() => {
        setIncidents(incidentsResponse?.incidents || []);
    }, [incidentsResponse]);

    useEffect(() => {
        const url = `${process.env.REACT_APP_WS_BASE_URL}/ws/submit-new-incidents`;
        const handleMessage = (event: MessageEvent) => {
            const newIncidents = JSON.parse(event.data);
            const filteredIncidents = newIncidents.filter((incident: { severity: string; status: string; }) => {
                return (!severity || incident.severity === severityMapping[severity]) &&
                    (!status || incident.status === statusMapping[status]);
            });

            setIncidents(prevIncidents => {
                const excessLength = [...filteredIncidents, ...prevIncidents].length - limit;

                if (excessLength > 0) {
                    if (dateSort === 'newest_first' && currentPage === 1) {
                        return [...filteredIncidents, ...prevIncidents.slice(0, prevIncidents.length - filteredIncidents.length)];
                    } else if (dateSort === 'oldest_first' && currentPage === lastPage) {
                        return [...prevIncidents.slice(filteredIncidents.length), ...filteredIncidents];
                    }
                }
                else {
                    if (dateSort === 'newest_first' && currentPage === 1) {
                        return [...filteredIncidents, ...prevIncidents];
                    } else if (dateSort === 'oldest_first' && currentPage === lastPage) {
                        return [...prevIncidents, ...filteredIncidents];
                    }
                }

                return prevIncidents
            });
        };

        const webSocketManager = createWebSocketConnection(url, handleMessage);

        return () => webSocketManager.disconnect();
    }, [severity, status, dateSort, currentPage, lastPage, limit]);

    const showPreviousButton = !!incidentsResponse?.incidentsCount && currentPage > 1;
    const showNextButton = currentPage < lastPage;

    if (areIncidentsLoading) return <div className="incidents-table__message">Загрузка инцидентов...</div>;
    if (isIncidentsError) return <div className="incidents-table__message">Произошла ошибка при загрузке инцидентов.</div>;

    return (
        <>
            <IncidentList
                incidents={incidents}
                refreshIncidentsList={refetch}
            />
            <Pagination
                lastPage={lastPage}
                refreshIncidentsList={refetch}
                showPreviousButton={showPreviousButton}
                showNextButton={showNextButton}
            />
        </>
    );
}
