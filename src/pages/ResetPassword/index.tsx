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
import { axiosInstance } from "@/api/axiosInstance";
import { useState } from "react";
import { showAlert } from "@/components/ShowAlerts";
const formSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
});

const checkEmail = async (
  email: string,
  setLoading: (loading: boolean) => void
) => {
  axiosInstance
    .post("password/email", { email })
    .then((response) => {
      console.log(response);
      setLoading(false);
      window.location.href = "/code/check";
    })
    .catch(() => {
      showAlert(
        "error",
        "Erro ao enviar e-mail",
        "Verifique se o e-mail está correto."
      );
      setLoading(false);
    });
};
export default function Reset() {
  const [isLoading, setIsLoading] = useState(false);
  const formEmailInput = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  function onSubmitReset(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    checkEmail(values.email, setIsLoading);
  }
  return (
    <>
      <Card className="sm:w-1/2 w-3/4">
        <CardHeader>
          <CardTitle>Esqueceu sua senha?</CardTitle>
          <CardDescription>
            Digite seu e-mail para enviarmos um código de recuperação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...formEmailInput}>
            <form
              onSubmit={formEmailInput.handleSubmit(onSubmitReset)}
              className="space-y-8"
            >
              <FormField
                control={formEmailInput.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="contato@agrotracker.com.br"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{isLoading ? "Enviando" : "Enviar"}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
