import React from "react";
import Home from "@/pages/Home";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import Login from "@/pages/Login";
const token = localStorage.getItem("access_token");
const isAuthenticated = token ? true : false;

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function RoutesComponent() {
  const location = useLocation();
  const showSidebar = location.pathname !== "/login";
  return (
    <>
      {showSidebar && <Sidebar />}
      <main
        className={
          showSidebar
            ? "sm:ml-14 p-4"
            : "flex h-screen justify-center items-center"
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />

          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </>
  );
}
