import React, { createContext, useContext, ReactNode } from "react";
import { axiosInstance } from "@/api/axiosInstance";
import { showAlert } from "@/components/ShowAlerts";
import Cookies from "js-cookie";

// Defina a interface para o contexto
interface AuthContextType {
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
  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("login", { email, password });
      showAlert("success", "Sucesso!", "Login efetuado com sucesso!");
      Cookies.set("access_token", response.data.access_token, {
        expires: 1 / 30,
      });
      Cookies.set("User_id", response.data.user.id, { expires: 1 / 30 });
      Cookies.set("Company_id", response.data.user.company_id, {
        expires: 1 / 30,
      });
      Cookies.set("User", JSON.stringify(response.data.user), {
        expires: 1 / 30,
      });
      setInterval(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      showAlert("error", "Oops...", "Erro ao efetuar login!");
    }
  };

  const logout = () => {
    axiosInstance
      .post("logout")
      .then(() => {
        showAlert("success", "Sucesso!", "Logout efetuado com sucesso!");
        Cookies.remove("access_token");
        Cookies.remove("User_id");
        Cookies.remove("Company_id");
        Cookies.remove("User");
        setInterval(() => {
          window.location.href = "/login";
        }, 1000);
      })
      .catch(() => {
        showAlert("error", "Oops...", "Erro ao efetuar logout!");
      });
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
