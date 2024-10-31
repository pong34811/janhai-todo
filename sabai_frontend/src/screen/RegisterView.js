import React, { useState } from "react";
import axios from "axios";
import { URL_AUTH } from "../routes/CustomAPI";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterView.css";

const RegisterView = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(URL_AUTH.RegisterAPI, {
        username,
        email,
        password,
      });
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="container-register">
        <div className="header-register">
          <Link to="/">
            <img src="/logo.png" className="item-img" alt="Logo" />
          </Link>
        </div>
        <div className="register-form">
          <div className="form-title">
            <h2>register</h2>
            <img src="/logo.png" className="item-img" alt="Logo" />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-input-register">
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <p>
                Have a member? <Link to="/login">Login</Link>
              </p>
            </div>
            <div className="form-button-register">
              <button type="submit">Register</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterView;
