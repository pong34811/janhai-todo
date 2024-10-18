import { Outlet, Link } from "react-router-dom";
import './HeaderView.css'

const HeaderView = () => {
    return (
        <>
            <header className="header flex justify-between items-center shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 p-4">
                <div className="flex items-center">
                    <img src="/logo.png" alt="logo" className="logo-img h-10" />
                </div>
                <nav className="nav-links flex items-center space-x-6">
                    <a href="#" className="nav-link">Features</a>
                    <a href="#" className="nav-link">Contact</a>
                    <a href="#" className="nav-link">Profile</a>
                    <button className="login-button">Log In</button>
                </nav>
            </header>

            <Outlet />
        </>
    )
};

export default HeaderView;