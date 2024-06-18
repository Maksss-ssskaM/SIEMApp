import React, { useState, useEffect, useRef } from 'react';
import {useActions} from "../../../../../hooks/actions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import "../../../../../styles/components/incidents/table/filters/DropdownFilter.scss"

interface SortListItem {
    name: string;
    sortProperty?: string;
}

interface DropdownFilterProps {
    sortList: SortListItem[];
    handleFilterChange: (sortProperty?: string) => void;
    currentValue?: string;
    title: string;
}

export function DropdownFilter({ sortList, handleFilterChange, currentValue, title }: DropdownFilterProps) {
    const { goToFirstPage } = useActions();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="filter-container">
            <div className="filter-header" onClick={toggleDropdown}>
                <b>{title}</b>
                <FontAwesomeIcon
                    icon={isDropdownOpen ? faChevronUp : faChevronDown}
                    size="sm"
                    color="white"
                />
            </div>
            {isDropdownOpen && (
                <ul className="filter-dropdown">
                    {sortList.map((item, index) => (
                        <li key={index} onClick={() => {
                            handleFilterChange(item.sortProperty);
                            goToFirstPage()
                            setIsDropdownOpen(false);
                        }} className={`filter-dropdown__item ${currentValue === item.sortProperty ? 'active' : ''}`}>
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}