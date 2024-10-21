import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { URL_AUTH } from '../routes/CustomAPI';

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

      
      navigate('/blogs'); // Redirect to boards page
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