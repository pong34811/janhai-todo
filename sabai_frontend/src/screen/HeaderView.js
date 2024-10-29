import { Outlet, Link } from "react-router-dom";
import "./HeaderView.css";

const HeaderView = () => {
  return (
    <>
        <header className="header-bar">
          <div className="group">
            <img src="/logo.png" className="item-img" />
          </div>
          <div className="group">
            <Link to="/features" className="item">
              Features
            </Link>
            <Link to="/contact" className="item">
              Contact
            </Link>
            <Link to="/profile" className="item">
              Profile
            </Link>
            <Link to="/login" className="item">
              Log In
            </Link>
          </div>
        </header>
        <Outlet />
    </>
  );
};

export default HeaderView;
