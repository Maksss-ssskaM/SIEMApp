import {useActions} from "../../../../hooks/actions";
import {useAppSelector} from "../../../../hooks/redux";
import "../../../../styles/components/incidents/table/Pagination.scss"

interface PaginationProps {
    lastPage: number;
    refreshIncidentsList: () => void;
    showPreviousButton: boolean;
    showNextButton: boolean;
}

export const Pagination = ({lastPage, refreshIncidentsList, showPreviousButton, showNextButton}: PaginationProps) => {
    const {goToPreviousPage, goToNextPage} = useActions();
    const {currentPage} = useAppSelector(state => state.pagination)

    return (
        <div className="pagination">
            {showPreviousButton && (
                <button onClick={() => {
                    goToPreviousPage()
                    refreshIncidentsList()
                }} className="pagination__button">&#x2190;</button>
            )}
            <span className="pagination__current">({currentPage} / {lastPage})</span>
            {showNextButton && (
                <button onClick={() => {
                    goToNextPage()
                    refreshIncidentsList()
                }} className="pagination__button">&#x2192;</button>
            )}
        </div>
    );
};