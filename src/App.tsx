import { BrowserRouter } from "react-router-dom";
import RoutesComponent from "./routes";
import { AuthProvider } from "./context/auth";
import { UserProvider } from "./context/UserContext";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <RoutesComponent />
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
