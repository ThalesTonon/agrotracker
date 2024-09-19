import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { showAlert } from "@/components/ShowAlerts";
import { axiosInstance } from "@/api/axiosInstance";
const formSchemaReset = z.object({
  password: z
    .string()
    .min(8, { message: "Senha deve conter no mínimo 8 caracteres" }),
  password_confirmation: z
    .string()
    .min(8, { message: "Senha deve conter no mínimo 8 caracteres" }),
});

interface NewPasswordProps {
  code: string;
}

function NewPassword(props: NewPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const formResetInput = useForm<z.infer<typeof formSchemaReset>>({
    resolver: zodResolver(formSchemaReset),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });
  const onSubmitNewPassword = (values: z.infer<typeof formSchemaReset>) => {
    console.log(values);
    if (values.password !== values.password_confirmation) {
      showAlert("error", "Senhas não conferem!", "As senhas devem ser iguais.");
      return;
    } else {
      resetPassword(values.password);
    }
  };
  function resetPassword(password: string) {
    console.log(props.code, password);
    axiosInstance
      .post("password/reset", { code: props.code, password })
      .then((response) => {
        console.log(response);
        showAlert(
          "success",
          "Senha alterada com sucesso!",
          "Agora você pode fazer login."
        );

        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      })
      .catch((error) => {
        console.log(error);
        showAlert("error", "Erro ao alterar senha!", "Tente novamente.");
      });
  }

  useEffect(() => {
    console.log(props);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Card className="sm:w-1/2 w-3/4">
        <CardHeader>
          <CardTitle>Resetar senha</CardTitle>
          <CardDescription>Digite sua nova senha.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...formResetInput}>
            <form
              onSubmit={formResetInput.handleSubmit(onSubmitNewPassword)}
              className="space-y-8"
            >
              <FormField
                control={formResetInput.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="flex flex-row gap-4">
                        <Input
                          type={showPassword ? "text" : "password"}
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
                control={formResetInput.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirme sua senha</FormLabel>
                    <FormControl>
                      <div className="flex flex-row gap-4">
                        <Input
                          type={showPasswordConfirmation ? "text" : "password"}
                          {...field}
                        />
                        <Button
                          type="button"
                          onClick={() =>
                            setShowPasswordConfirmation(
                              !showPasswordConfirmation
                            )
                          }
                        >
                          {showPasswordConfirmation ? (
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
              <Button type="submit">Resetar senha</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default NewPassword;
