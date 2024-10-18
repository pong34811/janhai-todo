import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import urls from '../server/urls'

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(urls.LoginAPI, {
        username,
        password,
      });
      const token = response.data.access;
      localStorage.setItem('token', token);
      navigate('/boards'); // Redirect to boards page
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
        <br />
        <label>Password:</label>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;