import React, {useState, useRef, useEffect} from 'react';
import {useUpdateIncidentMutation} from "../../redux/api/incidents.api";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCog} from '@fortawesome/free-solid-svg-icons';
import "../../styles/components/incidents/IncidentEditor.scss";

interface IncidentEditorProps {
    incidentId: string;
    title?: string;
    attribute: string;
    value: string;
    options?: string[];
    type?: 'text' | 'select';
    onUpdate: (attribute: string, newValue: string) => void
}

export const IncidentEditor = ({incidentId, title, attribute, value, options, type = 'text', onUpdate}: IncidentEditorProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newValue, setNewValue] = useState(value);
    const [updateIncident, {isLoading}] = useUpdateIncidentMutation();
    const modalContentRef = useRef<HTMLDivElement>(null);

    const handleUpdate = async () => {
        if (newValue !== value) {
            await updateIncident({identifier: incidentId, updateData: {[attribute]: newValue}});
            onUpdate(attribute, newValue);
            setIsEditing(false);
        }
        setIsEditing(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
                setIsEditing(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [modalContentRef]);

    const renderEditor = () => {
        if (type === 'select' && options) {
            return (
                <select
                    className="incident-editor__select"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    disabled={isLoading}
                >
                    {options.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            );
        } else {
            return (
                <input
                    type="text"
                    className="incident-editor__input"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    disabled={isLoading}
                />
            );
        }
    };

    return (
        <div className={`incident-editor ${type}`}>
            <button
                className="incident-editor__button-update"
                onClick={() => setIsEditing(true)}
            >
                <FontAwesomeIcon icon={faCog}/>
            </button>
            {isEditing && (
                <div className="incident-editor__modal">
                    <div
                        className="incident-editor__modal-content"
                        ref={modalContentRef}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {title && <p className="incident-editor__title">{title}</p>}
                        {renderEditor()}
                        <div className="incident-editor__buttons">
                            <button
                                className="incident-editor__button-save"
                                onClick={handleUpdate}
                                disabled={isLoading}
                            >
                                Сохранить
                            </button>
                            <button
                                className="incident-editor__button-cancel"
                                onClick={() => setIsEditing(false)}
                                disabled={isLoading}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
