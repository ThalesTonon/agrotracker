import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import {
  Calendar,
  Home,
  LogOut,
  Package,
  PanelBottom,
  Settings,
  SproutIcon,
  Tractor,
  Wallet,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/agroTrackerLogo.png";
import { useAuth } from "@/context/auth";
import Swal from "sweetalert2";
import { useContext, useState } from "react";
import { UserContext } from "@/context/UserContext";

export function Sidebar() {
  let pageTitle = useLocation().pathname.replace("/", "").toUpperCase();
  const [openSheet, setOpenSheet] = useState(false);
  if (pageTitle === "") {
    pageTitle = "HOME";
  }
  const handleLogout = () => {
    setOpenSheet(false);
    Swal.fire({
      title: "Tem certeza?",
      text: "Você deseja sair da sua conta?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#88D53D",
      cancelButtonColor: "#FF0000",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };
  const userContext = useContext(UserContext);

  const { logout } = useAuth();
  const imageUrl =
    "https://api.dicebear.com/9.x/initials/svg?radius=0&backgroundColor=88D53D&seed=" +
      userContext.user?.name || "User";
  return (
    <>
      {/* Menu Desktop */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            <Link
              to="/"
              className="flex h-9 w-9 shrink-0 items-center justify-center text-primary-foreground rounded-full bg-primary/20 transition-colors hover:bg-primary/10"
            >
              <img src={logo} alt="Logo do projeto" />

              <span className="sr-only">Logo do projeto</span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/"
                  className="flex h-9 w-9 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Início</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="planejamento"
                  className="flex h-9 w-9 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Calendar className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Planejamento</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="#"
                  className="flex h-9 w-9 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Estoque</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="#"
                  className="flex h-9 w-9 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Tractor className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Equipamentos</TooltipContent>
            </Tooltip>
            {(userContext.user?.role === "Admin" ||
              userContext.user?.role === "Super") && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to="financeiro"
                      className="flex h-9 w-9 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Wallet className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Financeiro</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to="produtos"
                      className="flex h-9 w-9 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <SproutIcon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Produtos</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to="#"
                      className="flex h-9 w-9 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Settings className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Configurações</TooltipContent>
                </Tooltip>
              </>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="#"
                  onClick={() => {
                    handleLogout();
                  }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  <LogOut className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      {/* Menu Mobile */}
      <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <div className="flex w-full flex-col bg-muted/40">
          <header className="sticky top-0 z-30 flex h-14 items-center px-4 border-b gap-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent">
            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
              <SheetTrigger asChild>
                <Button size="icon" variant="outline" className="sm:hidden">
                  <PanelBottom></PanelBottom>
                  <span className="sr-only">Abrir / Fechar Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
                <SheetDescription className="sr-only">
                  Use este menu para navegar pelas principais seções do site,
                  incluindo início, planejamento, financeiro, estoque, e mais.
                </SheetDescription>
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    to="#"
                    className="flex h-10 w-10 bg-primary/20 rounded-full items-center justify-center text-primary-foreground md:text-base"
                  >
                    <img src={logo} alt="Logo do projeto" />
                    <span className="sr-only">Logo do projeto</span>
                  </Link>
                  <Link
                    to="/"
                    onClick={() => {
                      setOpenSheet(false);
                    }}
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-primary-foreground"
                  >
                    <Home className="h-5 w-5 transition-all" />
                    Início
                  </Link>
                  <Link
                    to="planejamento"
                    onClick={() => {
                      setOpenSheet(false);
                    }}
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-primary-foreground"
                  >
                    <Calendar className="h-5 w-5 transition-all" />
                    Planejamento
                  </Link>

                  <Link
                    to="#"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-primary-foreground"
                  >
                    <Package className="h-5 w-5 transition-all" />
                    Estoque
                  </Link>
                  <Link
                    to="#"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-primary-foreground"
                  >
                    <Tractor className="h-5 w-5 transition-all" />
                    Equipamentos
                  </Link>
                  {(userContext.user?.role === "Admin" ||
                    userContext.user?.role === "Super") && (
                    <>
                      <Link
                        to="financeiro"
                        onClick={() => {
                          setOpenSheet(false);
                        }}
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-primary-foreground"
                      >
                        <Wallet className="h-5 w-5 transition-all" />
                        Financeiro
                      </Link>
                      <Link
                        to="produtos"
                        onClick={() => {
                          setOpenSheet(false);
                        }}
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-primary-foreground"
                      >
                        <SproutIcon className="h-5 w-5 transition-all" />
                        Produtos
                      </Link>
                      <Link
                        to="#"
                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-primary-foreground"
                      >
                        <Settings className="h-5 w-5 transition-all" />
                        Configurações
                      </Link>
                    </>
                  )}
                  <Link
                    onClick={() => {
                      handleLogout();
                    }}
                    to="#"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-primary-foreground"
                  >
                    <LogOut className="h-5 w-5 transition-all" />
                    Logout
                  </Link>
                </nav>
              </SheetContent>
              <h2>Menu</h2>
            </Sheet>
            {/* Navbar */}
            <div className="flex w-full items-center justify-around">
              <h1 className="text-xl font-bold">{pageTitle}</h1>
              <div className="flex gap-4">
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={imageUrl}
                    alt=""
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-sm">{userContext.user?.name || "User"}</p>
                  <p className="text-base">
                    {userContext.user?.role || "Função"}
                  </p>
                </div>
              </div>
            </div>
          </header>
        </div>
      </div>
    </>
  );
}
