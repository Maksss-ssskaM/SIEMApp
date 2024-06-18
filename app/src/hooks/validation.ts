import React, {useEffect, useState} from "react";

interface Validations {
    minLength?: number;
    maxLength?: number;
    isEmpty?: boolean;
}

export const useValidation = (value: string, validations: Validations) => {
    const [isEmpty, setEmpty] = useState(true);
    const [minLengthError, setMinLengthError] = useState(false)
    const [maxLengthError, setMaxLengthError] = useState(false)

    useEffect(() => {
        for (const validation in validations) {
            switch (validation) {
                case 'minLength':
                    if (typeof validations.minLength === "number") {
                        value.length < validations.minLength ? setMinLengthError(true) : setMinLengthError(false);
                    }
                    break
                case 'maxLength':
                    if (typeof validations.maxLength === "number") {
                        value.length > validations.maxLength ? setMaxLengthError(true) : setMaxLengthError(false);
                    }
                    break
                case 'isEmpty':
                    value ? setEmpty(false) : setEmpty(true)
                    break
            }
        }
    }, [value])

    return {isEmpty, minLengthError, maxLengthError}
}

export const useInput = (initialValue: string, validations: Validations, externalError: string = "") => {
    const [value, setValue] = useState(initialValue);
    const [isDirty, setDirty] = useState(false);
    const [error, setError] = useState(externalError);
    const valid = useValidation(value, validations);

    useEffect(() => {
        setError(externalError);
    }, [externalError]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setDirty(true);
    };

    return { value, onChange, onBlur, isDirty, error, ...valid };
};