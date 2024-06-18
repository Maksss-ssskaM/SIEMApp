import React, {useEffect, useState} from "react";
import {useActions} from "../../hooks/actions";
import {useInput} from "../../hooks/validation";
import {useChangePasswordMutation} from "../../redux/api/users.api";
import {ValidatedInputField} from "../ValidatedInputField";
import "../../styles/components/account/PasswordChangeForm.scss"

interface InputValidation {
    isEmpty: boolean;
    minLengthError: boolean;
    maxLengthError: boolean;
}

export const PasswordChangeForm = () => {
    const [changePasswordError, setChangePasswordError] = useState('');
    const [passwordMismatchError, setPasswordMismatchError] = useState('');

    const {clearToken} = useActions();
    const oldPassword = useInput('', {isEmpty: true, minLength: 8, maxLength: 128})
    const newPassword = useInput('', {isEmpty: true, minLength: 8, maxLength: 128})
    const repeatPassword = useInput('', {isEmpty: true}, passwordMismatchError)
    const [ChangePassword, {isLoading}] = useChangePasswordMutation();


    useEffect(() => {
        setPasswordMismatchError(newPassword.value !== repeatPassword.value ? "Пароли не совпадают." : "");
    }, [newPassword.value, repeatPassword.value]);


    const inputsAreValid = (inputs: InputValidation[]) => inputs.every(input =>
        !input.isEmpty &&
        !input.minLengthError &&
        !input.maxLengthError
    );

    const isFormValid = inputsAreValid([oldPassword, newPassword, repeatPassword])
        && newPassword.value === repeatPassword.value;

    const getErrorMessage = (field: InputValidation): string | undefined => {
        if (field.isEmpty) return "Поле не может быть пустым";
        if (field.minLengthError) return "Значение слишком короткое";
        if (field.maxLengthError) return "Значение слишком длинное";
        return undefined;
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (isFormValid) {
            try {
                await ChangePassword({old_password: oldPassword.value, new_password: newPassword.value}).unwrap();
                clearToken();
            } catch (error) {
                setChangePasswordError('Не удалось изменить пароль. Пожалуйста, попробуйте еще раз.');
            }
        }
    }


    return(
        <form className="password-change-form" onSubmit={handleSubmit}>
            <h2 className="password-change-form__title">Изменить пароль</h2>
            <div className="password-change-form__form-group">
                <label htmlFor="oldPassword" className="password-change-form__label">Старый пароль</label>
                <ValidatedInputField
                    type="password"
                    id="oldPassword"
                    value={oldPassword.value}
                    onChange={e => oldPassword.onChange(e)}
                    onBlur={e => oldPassword.onBlur(e)}
                    error={oldPassword.isDirty ? getErrorMessage(oldPassword) : undefined}
                />
            </div>
            <div className="password-change-form__form-group">
                <label htmlFor="newPassword" className="password-change-form__label">Новый пароль</label>
                <ValidatedInputField
                    type="password"
                    id="newPassword"
                    value={newPassword.value}
                    onChange={e => newPassword.onChange(e)}
                    onBlur={e => newPassword.onBlur(e)}
                    error={newPassword.isDirty ? getErrorMessage(newPassword) : undefined}
                />
            </div>
            <div className="password-change-form__form-group">
                <label htmlFor="repeatPassword" className="password-change-form__label">Повтор пароля</label>
                <ValidatedInputField
                    type="password"
                    id="repeatPassword"
                    value={repeatPassword.value}
                    onChange={e => repeatPassword.onChange(e)}
                    onBlur={e => repeatPassword.onBlur(e)}
                    error={repeatPassword.isDirty && !passwordMismatchError ? getErrorMessage(repeatPassword) : passwordMismatchError}
                />
            </div>
            <button className="password-change-form__submit"type="submit" disabled={!isFormValid || isLoading}>Изменить</button>
            {changePasswordError && <p className="password-change-form__error">{changePasswordError}</p>}
        </form>
    )
}