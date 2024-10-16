import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Boards from './components/boards/Boards.js';
import ListView from './components/boards/ListView'; 

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="/lists/:id" element={<ListView />} /> 
      </Routes>
    </BrowserRouter>
  );
};

export default App;