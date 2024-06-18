import "../../styles/components/incidents/EventList.scss"
import {useGetEventsQuery} from "../../redux/api/events.api";
import {formatIncidentDate} from "../../utils/utils";

interface EventsListProps{
    incident_id : string
}

export const EventList = ({ incident_id }: EventsListProps) => {
    const { isLoading, isError, data: events } = useGetEventsQuery(incident_id);

    if (isLoading) return <div className="events-list__message">Загрузка событий...</div>;
    if (isError) return <div className="events-list__message">Произошла ошибка при загрузке событий инцидента.</div>;

    return (
        <ul className="events-list">
            {events?.map(event => (
                <li key={event.event_id} className="events-list__item">
                    <p className="events-list__item-date">{formatIncidentDate(event.created_at)}</p>
                    <p className="events-list__item-description">{event.description}</p>
                </li>
            ))}
        </ul>
    );
};
