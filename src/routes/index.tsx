import Home from "@/pages/Home";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import Login from "@/pages/Login";
import Cookies from "js-cookie";
import Planejamento from "@/pages/Planejamento";
import Financeiro from "@/pages/Financeiro";
import Produtos from "@/pages/Produtos";
import Estoque from "@/pages/Estoque";
import Reset from "@/pages/ResetPassword";
import CheckCode from "@/pages/ResetPassword/send-code";
import Equipamentos from "@/pages/Equipamentos";
import Configuracoes from "@/pages/Configuracoes";

const isAuthenticated = Cookies.get("access_token") ? true : false;

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated ? children : <Navigate to="/login" />;
};
const RestricteRouteSideBar = (): boolean => {
  const location = useLocation();
  const currentPath = location.pathname;
  const restrictedPaths = ["/login", "/forgot-password", "/code/check"];
  return restrictedPaths.includes(currentPath) ? false : true;
};
export default function RoutesComponent() {
  const showSidebar = RestricteRouteSideBar();

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
            path="/equipamentos"
            element={
              <PrivateRoute>
                <Equipamentos />
              </PrivateRoute>
            }
          />
          <Route
            path="/configuracoes"
            element={
              <PrivateRoute>
                <Configuracoes />
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
          <Route path="/forgot-password" element={<Reset />} />
          <Route path="/code/check" element={<CheckCode />} />
        </Routes>
      </main>
    </>
  );
}
