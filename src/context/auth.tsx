import React, { createContext, useState, useContext, ReactNode } from "react";
import { axiosInstance } from "@/api/axiosInstance";
import { showAlert } from "@/components/ShowAlerts";

// Defina a interface para o contexto
interface AuthContextType {
  user: {} | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

// Crie o contexto com um valor padrão
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função helper para acessar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    try {
      axiosInstance
        .post("login", { email, password })
        .then((response) => {
          showAlert("success", "Sucesso!", "Login efetuado com sucesso!");
          localStorage.setItem("access_token", response.data.access_token);
          setUser(response.data.user);
          setIsAuthenticated(true);
          setInterval(() => {
            window.location.href = "/";
          }, 2000);
        })
        .catch(() => {
          showAlert("error", "Oops...", "Email ou senha inválidos!");
          return;
        });
    } catch (error) {
      showAlert("error", "Oops...", "Erro ao efetuar login!");
    }
  };

  const logout = () => {
    axiosInstance
      .post("logout")
      .then(() => {
        showAlert("success", "Sucesso!", "Logout efetuado com sucesso!");
        localStorage.removeItem("access_token");
        setUser(null);
        setIsAuthenticated(false);
        setInterval(() => {
          window.location.href = "/login";
        }, 2000);
      })
      .catch(() => {
        showAlert("error", "Oops...", "Erro ao efetuar logout!");
      });
  };
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
