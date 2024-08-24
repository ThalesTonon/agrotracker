import NavBar from "@/components/NavBar";
import { UserContext } from "@/context/UserContext";
import { useContext } from "react";

export default function Home() {
  const { user } = useContext(UserContext);
  return (
    <div>
      <NavBar title="Home" user={user} />
    </div>
  );
}
