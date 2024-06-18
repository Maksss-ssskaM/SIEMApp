import React from 'react';
import "../styles/components/ValidatedInputField.scss"

interface ValidatedInputFieldProps {
    id: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    error?: string;
}

export const ValidatedInputField = ({ id, type, value, onChange, onBlur, error }: ValidatedInputFieldProps) => {
    return (
        <>
            <input
                className="input-field"
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
            />
            {error && <div className="input-field__error">{error}</div>}
        </>
    );
};