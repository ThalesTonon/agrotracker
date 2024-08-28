import { UserContext } from "@/context/UserContext";
import { useContext } from "react";

interface NavBarProps {
  title: string;
}
export default function NavBar(props: NavBarProps) {
  const title = props.title.toUpperCase();
  const userContext = useContext(UserContext);
  let userImageURL =
    "https://api.dicebear.com/9.x/initials/svg?radius=0&backgroundColor=88D53D&seed=" +
      userContext.user?.name || "User";
  return (
    <nav className="hidden sm:flex w-full items-center bg-muted/40 py-4 rounded-full mb-4">
      <div className="flex w-full justify-start pl-8">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <div className="flex w-full justify-end pr-8">
        <div className="flex items-center gap-4">
          <img
            className="rounded-full h-10 w-10 "
            src={userImageURL}
            alt={userContext.user?.name || "User"}
          />
          <div>
            <p>{userContext.user?.name || "User"}</p>
            <p>{userContext.user?.role || "Função"}</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
