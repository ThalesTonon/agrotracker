import Home from "@/pages/Home";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import Login from "@/pages/Login";
import Cookies from "js-cookie";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = Cookies.get("access_token") ? true : false;
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
            ? "sm:ml-14 p-4 h-screen"
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
          <Route
            path="/home"
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
