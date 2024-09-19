import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { axiosInstance } from "@/api/axiosInstance";
import { showAlert } from "@/components/ShowAlerts";
import { useAuth } from "@/context/auth";

// Formulário de login
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link } from "react-router-dom";

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
const formSchemaLogin = z.object({
  email: z
    .string({ required_error: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  password: z
    .string({ required_error: "Senha é obrigatória" })
    .min(8, "Senha deve ter no mínimo 8 caracteres"),
});
const formSchemaRegister = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }),
  email: z
    .string({ required_error: "Email é obrigatório" })
    .email({ message: "Email inválido" }),
  password: z
    .string({ required_error: "Senha é obrigatória" })
    .min(8, "Senha deve ter no mínimo 8 caracteres"),
  confirmPassword: z
    .string({
      required_error: "Confirmação de senha é obrigatória",
    })
    .min(8, "Senha deve ter no mínimo 8 caracteres"),
  company_id: z.string({ required_error: "Empresa é obrigatória" }),
  role: z.string({ required_error: "Função é obrigatória" }),
});

export default function Login() {
  const formLogin = useForm<z.infer<typeof formSchemaLogin>>({
    resolver: zodResolver(formSchemaLogin),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  function onSubmitLogin(values: z.infer<typeof formSchemaLogin>) {
    login(values.email, values.password);
  }
  const formRegister = useForm<z.infer<typeof formSchemaRegister>>({
    resolver: zodResolver(formSchemaRegister),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      company_id: "",
    },
  });
  function onSubmitRegister(values: z.infer<typeof formSchemaRegister>) {
    setAuthLoading(true);
    if (values.password !== values.confirmPassword) {
      showAlert("error", "Oops...", "As senhas não conferem!");
      setAuthLoading(false);
      return;
    }
    if (values.company_id === "Carregando") {
      showAlert(
        "error",
        "Carregando...",
        "Carregando empresas, aguarde um momento!"
      );
      setAuthLoading(false);
      return;
    }
    axiosInstance
      .post("register", {
        name: values.name,
        email: values.email,
        password: values.password,
        password_confirmation: values.confirmPassword,
        company_id: values.company_id,
        role: values.role,
      })
      .then(() => {
        showAlert("success", "Sucesso!", "Usuário criado com sucesso!");
        setAuthLoading(false);
      })
      .catch((error) => {
        showAlert("error", "Oops...", error.response?.data?.message);
        setAuthLoading(false);
      });
  }
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  const [data, setData] = useState<Company[] | null>(null);

  useEffect(() => {
    axiosInstance
      .get<Company[]>("company")
      .then((response) => {
        setData(response.data);
        setIsLoadingCompany(false);
      })
      .catch(() => {
        setIsLoadingCompany(true);
      })
      .finally(() => {
        setIsLoadingCompany(false);
      });
  }, []);

  const [authLoading, setAuthLoading] = useState(false); // Estado para o carregamento da autenticação
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para mostrar a confirmação da senha
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar a senha
  const { login } = useAuth();

  return (
    <>
      <Tabs defaultValue="login" className="w-[400px] text-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
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
              <Form {...formLogin}>
                <form
                  onSubmit={formLogin.handleSubmit(onSubmitLogin)}
                  className="space-y-8"
                >
                  <FormField
                    control={formLogin.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="contato@agrotracker.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Email utilizado para acessar a plataforma.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formLogin.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <div className="flex w-full max-w-sm items-center space-x-2">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="********"
                              {...field}
                            />
                            <Button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Senha utilizada para acessar a plataforma.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-between">
                    <Button type="submit">Entrar</Button>
                    <Link to="/forgot-password" className="text-sm ">
                      Esqueceu a senha?
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
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
              <Form {...formRegister}>
                <form
                  onSubmit={formRegister.handleSubmit(onSubmitRegister)}
                  className="w-full space-y-3"
                >
                  <FormField
                    control={formRegister.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input
                            required
                            placeholder="Nome Completo"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formRegister.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input required placeholder=" Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formRegister.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <div className="flex w-full max-w-sm items-center space-x-2">
                            <Input
                              required
                              type={showPassword ? "text" : "password"}
                              placeholder="********"
                              {...field}
                            />
                            <Button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formRegister.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Senha</FormLabel>
                        <FormControl>
                          <div className="flex w-full max-w-sm items-center space-x-2">
                            <Input
                              required
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="********"
                              {...field}
                            />
                            <Button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOffIcon />
                              ) : (
                                <EyeIcon />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-row">
                    <div className="w-1/2 ">
                      <FormField
                        control={formRegister.control}
                        name="company_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Empresa</FormLabel>
                            <div className="flex w-4/5 max-w-sm items-center space-x-2">
                              <FormControl>
                                <Select required onValueChange={field.onChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Empresa" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {isLoadingCompany && (
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
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="w-1/2 ">
                      <FormField
                        control={formRegister.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Função</FormLabel>
                            <div className="flex w-4/5 max-w-sm items-center space-x-2">
                              <FormControl>
                                <Select required onValueChange={field.onChange}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Função" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Super">DEV</SelectItem>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="Colaborador">
                                      Colaborador
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <Button type="submit">
                    {authLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Criar Conta"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
