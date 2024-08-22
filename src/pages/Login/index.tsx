import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { axiosInstance } from "@/api/axiosInstance";
import { showAlert } from "@/components/ShowAlerts";

type Company = {
  id: number;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  created_at: string;
  updated_at: string;
};

export default function Login() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Company[] | null>(null);

  useEffect(() => {
    axiosInstance
      .get<Company[]>("company")
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch(() => {
        showAlert(
          "error",
          "Oops...",
          "Erro ao carregar empresas! Tente novamente mais tarde."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const [authLoading, setAuthLoading] = useState(false); // Estado para o carregamento da autenticação
  const [name, setName] = useState(""); // Estado para o nome
  const [email, setEmail] = useState(""); // Estado para o email
  const [password, setPassword] = useState(""); // Estado para a senha
  const [confirmPassword, setConfirmPassword] = useState(""); // Estado para mostrar a senha
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para mostrar a confirmação da senha
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar a senha
  const [companySelected, setCompanySelected] = useState("Teste"); // Estado para a empresa selecionada
  const [roleSelected, setRoleSelected] = useState(""); // Estado para a função selecionada
  const emailValidation = () => {
    let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (emailReg.test(email) === false) {
      showAlert("error", "Oops...", "Email inválido!");
      setAuthLoading(false);
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    setAuthLoading(true);
    if (emailValidation() === false) {
      return;
    }
    if (password === "") {
      showAlert("error", "Oops...", "Digite uma senha!");
      setAuthLoading(false);
      return;
    }
    axiosInstance
      .post("login", { email, password })
      .then((response) => {
        showAlert("success", "Sucesso!", "Login efetuado com sucesso!");
        localStorage.setItem("access_token", response.data.access_token);
        window.location.href = "/";
      })
      .catch(() => {
        showAlert("error", "Oops...", "Email ou senha inválidos!");
        setAuthLoading(false);
        return;
      });
  };
  const handleRegister = () => {
    setAuthLoading(true);
    if (name === "") {
      showAlert("error", "Oops...", "Digite um nome!");
      setAuthLoading(false);
      return;
    }
    if (emailValidation() === false) {
      return;
    }
    if (password === "") {
      setAuthLoading(false);
      showAlert("error", "Oops...", "Digite uma senha!");
      return;
    }
    if (password !== confirmPassword) {
      setAuthLoading(false);
      showAlert("error", "Oops...", "As senhas não conferem!");
      return;
    }
    axiosInstance
      .post("register", {
        name,
        email,
        password,
        password_confirmation: confirmPassword,
        company_id: companySelected,
        role: roleSelected,
      })
      .then(() => {
        setAuthLoading(false);
        showAlert("success", "Sucesso!", "Usuário criado com sucesso!");
      })
      .catch((error) => {
        setAuthLoading(false);
        showAlert(
          "error",
          "Oops...",
          error.response?.data?.message || "Informações inválidas!"
        );
        return;
      });
  };

  return (
    <Tabs defaultValue="login" className="w-[400px] text-sm">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Conta</TabsTrigger>
        <TabsTrigger value="register">Criar Conta</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Preencha os campos para acessar a sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Senha</Label>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleLogin()}>
              {authLoading ? "Carregando..." : "Entrar"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle>Registrar</CardTitle>
            <CardDescription>
              Preencha os campos para criar uma nova conta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Nome</Label>
              <Input
                onChange={(e) => setName(e.target.value)}
                type="text"
                id="name"
                placeholder="Nome Completo"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Senha</Label>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Senha"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirmar Senha"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </Button>
              </div>
            </div>
            <div className="flex flex-row">
              <div className="w-1/2 ">
                <Label>Empresas</Label>
                <div className="flex w-4/5 max-w-sm items-center space-x-2">
                  <Select onValueChange={setCompanySelected}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Empresas" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading && (
                        <SelectItem value="Carregando">
                          Carregando...
                        </SelectItem>
                      )}
                      {data?.map((company) => (
                        <SelectItem
                          key={company.id}
                          value={company.id.toString()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="w-1/2">
                <Label>Função</Label>
                <div className="flex w-full max-w-sm items-center">
                  <Select onValueChange={setRoleSelected}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Super">DEV</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Colaborador">Colaborador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pl-6 pb-3">
            <Button onClick={() => handleRegister()}>
              {authLoading ? "Carregando..." : "Criar conta"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
