import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginView from "../pages/LoginView";
import HomeView from "../pages/HomeView";
import NoPage404 from "../pages/NoPage404";
import BoardView from "../pages/BoardView";
import HeaderView from '../pages/HeaderView';
import ProtectedRoute from './ProtectedRoute';



function CustomRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/" element={<HeaderView />}>
          <Route index element={<HomeView />} />
        </Route>
        <Route path="/boards" element={<ProtectedRoute />} >
          <Route index element={<BoardView />} />
        </Route>
        <Route path="*" element={<NoPage404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default CustomRoute;


