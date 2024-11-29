import React from "react";
import { BrowserRouter, Routes, Route ,Navigate  } from "react-router-dom";
import LoginView from "../screen/LoginView";
import HomeView from "../screen/HomeView";
import NoPage404 from "../screen/NoPage404";
import BoardView from "../screen/BoardView";
import HeaderView from "../screen/HeaderView";
import ProtectedRoute, { isAuthenticated } from "./ProtectedRoute"; 
import RegisterView from "../screen/RegisterView";
import ListView from "../screen/ListView";



function CustomRoute() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}

        <Route path="/login" element={!isAuthenticated() ? <LoginView /> : <Navigate to="/boards" />} />
        <Route path="/register" element={!isAuthenticated() ? <RegisterView /> : <Navigate to="/boards" />} />
        <Route path="/" element={isAuthenticated() ? <Navigate to="/boards" /> : <HeaderView />}>
          <Route index element={isAuthenticated() ? <Navigate to="/boards" /> : <HomeView />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/boards" element={<BoardView />} />
          <Route path="/lists/:id" element={<ListView />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NoPage404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default CustomRoute;
