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
  Tractor,
  Wallet,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import logo from "@/assets/agroTrackerLogo.png";
import { useAuth } from "@/context/auth";
import Swal from "sweetalert2";

export function Sidebar() {
  const { logout } = useAuth();
  const handleLogout = () => {
    Swal.fire({
      title: "Você tem certeza?",
      text: "Você será deslogado do sistema!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, deslogar!",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  };
  return (
    <div className="flex w-full flex-col bg-muted/40">
      {/* Menu Desktop */}''
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
                  to="#"
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
                  to="#"
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
                  <Wallet className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Financeiro</TooltipContent>
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
        <header className="sticky top-0 z-30 flex h-14 items-center px-4 border-b gap-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent">
          <Sheet>
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
                  className="flex h-10 w-10 bg-primary rounded-full items-center justify-center text-primary-foreground md:text-base gap-2"
                >
                  <Package className="h-5 w-5" />
                  <span className="sr-only">Logo do projeto</span>
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-primary-foreground"
                >
                  <Home className="h-5 w-5 transition-all" />
                  Início
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-primary-foreground"
                >
                  <Calendar className="h-5 w-5 transition-all" />
                  Planejamento
                </Link>
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-primary-foreground"
                >
                  <Wallet className="h-5 w-5 transition-all" />
                  Financeiro
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
                <Link
                  to="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-primary-foreground"
                >
                  <Settings className="h-5 w-5 transition-all" />
                  Configurações
                </Link>
                <Link
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
        </header>
      </div>
    </div>
  );
}
