import React from 'react';
import {Route, Routes} from "react-router-dom";
import {Navigation} from "./components/Navigation";
import {AuthPage} from "./pages/AuthPage";
import {ProtectedRoute} from "./components/auth/ProtectedRoute";
import {IncidentPage} from "./pages/IncidentPage";
import {AccountPage} from "./pages/AccountPage";

function App() {
    return (
        <>
            <Navigation/>
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<IncidentPage/>}/>
                    <Route path="account" element={<AccountPage/>}/>
                </Route>
                <Route path="auth" element={<AuthPage/>}/>
            </Routes>
        </>
    );
}

export default App;
