import { axiosInstance } from "@/api/axiosInstance";
import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";

export type UserContextType = {
  user: any;
  setUser: any;
  isAuth: boolean;
};
type UserContextProviderType = {
  children: React.ReactNode;
};
type AuthUser = {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  company_id: number;
  role: string;
};

export const UserContext = createContext({} as UserContextType);

export const UserProvider = ({ children }: UserContextProviderType) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuth] = useState(false);

  const token = Cookies.get("access_token");
  const userId = Cookies.get("User_id");
  const [hasFetched, setHasFetched] = useState(false);

  const updateUser = () => {
    if (!hasFetched && token) {
      if (userId !== null && userId !== undefined) {
        axiosInstance
          .get("users/" + userId)
          .then((response) => {
            setUser({
              id: response.data.id,
              name: response.data.name,
              email: response.data.email,
              created_at: response.data.created_at,
              updated_at: response.data.updated_at,
              company_id: response.data.company_id,
              role: response.data.role,
            });
            setHasFetched(true); // Marcar como já buscado
          })
          .catch((error) => {
            console.error("User data error:", error);
          });
      }
    }
  };

  useEffect(() => {
    updateUser();
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setUser, isAuth }}>
      {children}
    </UserContext.Provider>
  );
};
