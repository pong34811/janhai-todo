import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { URL_AUTH } from "../routes/CustomAPI";
import "./LoginView.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [message, setmessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(URL_AUTH.LoginAPI, {
        username,
        password,
      });
      const { access, user } = response.data;
      localStorage.setItem("token", access);
      localStorage.setItem("username", user.username);
      navigate("/boards");
    } catch {
      setmessage("กรอกกรุณาตรวจสอบข้อมูล User เเละ Password ใหม่ ?");
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setmessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      {message && (
        <div className="message-box">
          <p>{message}</p>
        </div>
      )}
      <main>
        <div className="container-login">
          <div className="header-login">
            <Link to="/">
              <img src="/logo.png" className="item-img" alt="Logo" />
            </Link>
          </div>
          <div className="login-form">
            <form onSubmit={handleSubmit}>
              <div className="form-title">
                <h2>Login</h2>
                <img src="/logo.png" className="item-img" alt="Logo" />
              </div>
              <div className="form-input-login">
                <label>Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <p>
                  No account? <Link to="/register">Register</Link> or{" "}
                  <Link to="/reset-password">Forget password</Link>.
                </p>
              </div>

              <div className="form-button-login">
                <button type="submit">Login</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
