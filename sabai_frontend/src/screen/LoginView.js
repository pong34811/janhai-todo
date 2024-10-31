import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { URL_AUTH } from "../routes/CustomAPI";
import "./LoginView.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(URL_AUTH.LoginAPI, {
        username,
        password,
      });
      const { access, refresh, user } = response.data;
      // เก็บ token ใน localStorage
      localStorage.setItem("token", access);
      localStorage.setItem("username", user.username); // เก็บ username

      navigate("/boards"); // Redirect to boards page
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
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
                  Not a member? <Link to="/register">Register</Link>
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
