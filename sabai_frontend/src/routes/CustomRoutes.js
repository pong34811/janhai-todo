import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginView from "../screen/LoginView";
import HomeView from "../screen/HomeView";
import NoPage404 from "../screen/NoPage404";
import BoardView from "../screen/BoardView";
import HeaderView from '../screen/HeaderView';
import ProtectedRoute from './ProtectedRoute';
import RegisterView from '../screen/RegisterView';
import ListView from '../screen/ListView';



function CustomRoute() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />


        <Route path="/" element={<HeaderView />}>
          <Route index element={<HomeView />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/boards" element={<BoardView />} />
          <Route path="/lists/:id" element={<ListView />} />
        </Route>

        {/* <Route path="/lists/:id" element={<ListView />} /> */}
        
        <Route path="*" element={<NoPage404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default CustomRoute;


