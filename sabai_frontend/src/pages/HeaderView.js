import { Outlet, Link } from "react-router-dom";
import './HeaderView.css';

const HeaderView = () => {
    return (
        <>
            <header className="header">
                <div className="flex items-center">
                    <img src="/logo.png" alt="logo" className="logo-img" />
                </div>
                <nav className="nav-links">
                    <Link to="/features" className="nav-link">Features</Link>
                    <Link to="/contact" className="nav-link">Contact</Link>
                    <Link to="/profile" className="nav-link">Profile</Link>
                    <Link to="/login" className="login-button">Log In</Link>
                </nav>
            </header>
            <Outlet />
        </>
    );
};

export default HeaderView;
