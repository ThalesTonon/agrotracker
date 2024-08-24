interface NavBarProps {
  title: string;
  user: {
    photo: string;
    name: string;
    role: string;
  };
}

export default function NavBar(props: NavBarProps) {
  const title = props.title.toUpperCase();
  let userImageURL =
    "https://api.dicebear.com/9.x/initials/svg?radius=0&backgroundColor=b6e3f4&seed=" +
      props.user?.name || "User";
  return (
    <nav className="hidden sm:flex w-full items-center bg-muted/80 py-4 rounded-full">
      <div className="flex w-full justify-start pl-8">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      <div className="flex w-full justify-end pr-8">
        <div className="flex items-center gap-4">
          <img
            className="rounded-full h-10 w-10 "
            src={userImageURL}
            alt={props.user?.name}
          />
          <div>
            <p>{props.user?.name || "User"}</p>
            <p>{props.user?.role || "Função"}</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
