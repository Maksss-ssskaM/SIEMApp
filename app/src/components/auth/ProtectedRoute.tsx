import {Navigate, Outlet} from 'react-router-dom';
import {useAppSelector} from "../../hooks/redux";
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    exp?: number;
}

export const ProtectedRoute = () => {
    const { accessToken } = useAppSelector(state => state.auth);

    const isTokenValid = () => {
        if (!accessToken) return false;
        const decoded: DecodedToken = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;
        return decoded.exp !== undefined && decoded.exp > currentTime;
    };

    if (!isTokenValid()) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
};