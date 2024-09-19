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
import { Link } from "react-router-dom";
import { useState } from "react";
import NewPassword from "./new-password";
import { showAlert } from "@/components/ShowAlerts";
const formSchema = z.object({
  code: z
    .string()
    .min(6, { message: "Código inválido, deve conter 6 dígitos" }),
});

function verifyCode(
  code: string,
  setLoading: (loading: boolean) => void
): Promise<boolean> {
  return axiosInstance
    .post("password/code/check", { code })
    .then(() => {
      setLoading(false);
      return true;
    })
    .catch(() => {
      showAlert("error", "Código inválido", "Verifique o código digitado.");
      setLoading(false);
      return false;
    });
}

export default function CheckCode() {
  const [codeIsValid, setCodeIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formEmailInput = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });
  function onSubmitReset(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    verifyCode(values.code, setIsLoading).then(setCodeIsValid);
  }

  return (
    <>
      {codeIsValid ? (
        <NewPassword code={formEmailInput.getValues().code} />
      ) : (
        <Card className="sm:w-1/2 w-3/4">
          <CardHeader>
            <CardTitle>Confirme seu código</CardTitle>
            <CardDescription>
              Caso não tenha recebido o código, clique em reenviar.
              <br />
              <Link
                to="/forgot-password"
                className="text-xs font-bold hover:text-slate-400"
              >
                Reenviar código
              </Link>
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
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 224034" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  {isLoading ? "Verificando..." : "Verificar código"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
