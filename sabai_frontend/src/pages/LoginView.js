import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { URL_AUTH } from '../routes/CustomAPI';
import './LoginView.css'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      localStorage.setItem('token', access);
      localStorage.setItem('username', user.username); // เก็บ username

      navigate('/boards'); // Redirect to boards page
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
