import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return Boolean(token);
};

export default function ProtectedRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
}

