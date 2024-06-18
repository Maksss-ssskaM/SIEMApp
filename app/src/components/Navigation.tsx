import logo from '../assets/images/logo.png'
import {Link} from "react-router-dom";
import '../styles/components/Navigation.scss'
import {useAppSelector} from "../hooks/redux";

export function Navigation() {
    const {accessToken} = useAppSelector(state => state.auth)

    return (
        <nav className="nav">
            <img src={logo} alt="Oxygen Logo" className='nav__logo' />
            {accessToken && (
                <ul className="nav__list">
                    <li><Link to="/" className="nav__link">Инциденты</Link></li>
                    <li><Link to="/account" className="nav__link">Аккаунт</Link></li>
                </ul>
            )}
        </nav>
    );
}