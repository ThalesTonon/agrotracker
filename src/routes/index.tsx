import Home from "@/pages/Home";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import Login from "@/pages/Login";
import Cookies from "js-cookie";
import Planejamento from "@/pages/Planejamento";
import Financeiro from "@/pages/Financeiro";
import Produtos from "@/pages/Produtos";
import Estoque from "@/pages/Estoque";

const isAuthenticated = Cookies.get("access_token") ? true : false;

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
          <Route
            path="/estoque"
            element={
              <PrivateRoute>
                <Estoque />
              </PrivateRoute>
            }
          />

          <Route
            path="/planejamento"
            element={
              <PrivateRoute>
                <Planejamento />
              </PrivateRoute>
            }
          />

          <Route
            path="/financeiro"
            element={
              <PrivateRoute>
                <Financeiro />
              </PrivateRoute>
            }
          />
          <Route
            path="/produtos"
            element={
              <PrivateRoute>
                <Produtos />
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
