import React from "react";
import {AuthForm} from "../components/auth/AuthForm";
import "../styles/pages/AuthPage.scss"

export function AuthPage() {
    return (
        <div className="auth-page">
            <AuthForm/>
        </div>
    );
}