import React, {useState} from "react";
import {useLoginUserMutation} from "../../redux/api/authApi/auth.api";
import {useInput} from "../../hooks/validation";
import {useActions} from "../../hooks/actions";
import {useNavigate} from "react-router-dom";
import {ValidatedInputField} from "../ValidatedInputField";
import "../../styles/components/auth/AuthForm.scss";

interface InputValidation {
    isEmpty: boolean;
    minLengthError: boolean;
    maxLengthError: boolean;
}

export const AuthForm = () => {
    const navigate = useNavigate();

    const username = useInput('', {isEmpty: true, minLength: 1});
    const password = useInput('', {isEmpty: true, minLength: 8, maxLength: 128});

    const [LoginUser, { isLoading }] = useLoginUserMutation();
    const {setAccessToken, setRefreshToken} = useActions();

    const [authError, setAuthError] = useState('');

    const isFormValid = !username.isEmpty && !password.isEmpty && !password.minLengthError && !password.maxLengthError;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (isFormValid) {
            try {
                const userData = await LoginUser({username: username.value, password: password.value}).unwrap();
                setAccessToken(userData.access_token);
                setRefreshToken(userData.refresh_token);
                navigate('/')
                setAuthError('');
            } catch (err) {
                setAuthError("Некорректный логин или пароль.");
            }
        }
    };

    const getErrorMessage = (field: InputValidation): string | undefined => {
        if (field.isEmpty) return "Поле не может быть пустым";
        if (field.minLengthError) return "Значение слишком короткое";
        if (field.maxLengthError) return "Значение слишком длинное";
        return undefined;
    };

    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2 className="auth-form__title">Авторизация</h2>
            <div className="auth-form__form-group">
                <label htmlFor="username" className="auth-form__label">Логин</label>
                <ValidatedInputField
                    id="username"
                    type="text"
                    value={username.value}
                    onChange={username.onChange}
                    onBlur={username.onBlur}
                    error={username.isDirty ? getErrorMessage(username) : undefined}
                />
            </div>
            <div className="auth-form__form-group">
                <label htmlFor="password" className="auth-form__label">Пароль</label>
                <ValidatedInputField
                    id="password"
                    type="password"
                    value={password.value}
                    onChange={password.onChange}
                    onBlur={password.onBlur}
                    error={password.isDirty ? getErrorMessage(password) : undefined}
                />
            </div>

            <button className="auth-form__submit" type="submit" disabled={!isFormValid || isLoading}>Войти</button>
            {authError && <p className="auth-form__error">{authError}</p>}
            <p className="auth-form__registration">Нет доступа? <a href="https://t.me/MPSIEM_notifications_bot" className="auth-form__link">Регистрация</a></p>
        </form>
    );
};