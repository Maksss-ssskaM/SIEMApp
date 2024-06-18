import React from "react";
import "../styles/pages/AccountPage.scss";
import {useActions} from "../hooks/actions";
import {PasswordChangeForm} from "../components/account/PasswordChangeForm";
import {useGetUserInfoQuery} from "../redux/api/users.api";
import {formatIncidentDate} from "../utils/utils";

export function AccountPage() {
    const {clearToken} = useActions();
    const {data: userInfoResponse} = useGetUserInfoQuery();

    return (
        <div className="account-page">
            <div className="account-page__info">
                <h1 className="account-page__info-title">Аккаунт</h1>
                <p className="account-page__info-detail"><span>ID:</span> {userInfoResponse?.user_id}</p>
                <p className="account-page__info-detail"><span>Username:</span> {userInfoResponse?.username}</p>
                <p className="account-page__info-detail">
                    <span>Зарегистрирован:</span>
                    {userInfoResponse?.created_at ? formatIncidentDate(userInfoResponse.created_at) : 'Данные отсутствуют'}
                </p>
                <button className="account-page__logout-button" onClick={e => clearToken()}>
                    Выйти
                </button>
            </div>
            <PasswordChangeForm/>
        </div>
    );
}