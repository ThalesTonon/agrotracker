import { axiosInstance } from "@/api/axiosInstance";
import { showAlert } from "@/components/ShowAlerts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Cookies from "js-cookie";
import React from "react";
import Swal from "sweetalert2";
import { create } from "zustand";

type EstoqueState = {
  nome: string;
  descricao: string;
  quantidade: string;
  preco_unitario: string;
  data_entrada: string;
  data_expiracao: string;
};
type StorageAPI = {
  name: string;
  description: string;
  quantity: string;
  unitary_value: string;
  entry_date: string;
  expiration_date: string;
  company_id: string;
};

type EstoqueActions = {
  setNome: (nome: string) => void;
  setDescricao: (descricao: string) => void;
  setQuantidade: (quantidade: string) => void;
  setPrecoUnitario: (preco_unitario: string) => void;
  setDataEntrada: (data_entrada: string) => void;
  setDataExpiracao: (data_expiracao: string) => void;
};

const useEstoque = create<EstoqueState & EstoqueActions>((set) => ({
  nome: "",
  descricao: "",
  quantidade: "",
  preco_unitario: "",
  data_entrada: "",
  data_expiracao: "",
  setNome: (nome) => set({ nome }),
  setDescricao: (descricao) => set({ descricao }),
  setQuantidade: (quantidade) => set({ quantidade }),
  setPrecoUnitario: (preco_unitario) => set({ preco_unitario }),
  setDataEntrada: (data_entrada) => set({ data_entrada }),
  setDataExpiracao: (data_expiracao) => set({ data_expiracao }),
}));
function addEstoqueAPI() {
  const userJson = JSON.parse(Cookies.get("User") || "{}");
  const idCompanyByUser = userJson.company_id;
  let dados = useEstoque.getState();
  let novoEstoque: StorageAPI = {
    name: dados.nome,
    description: dados.descricao,
    quantity: dados.quantidade,
    unitary_value: dados.preco_unitario,
    entry_date: dados.data_entrada,
    expiration_date: dados.data_expiracao,
    company_id: idCompanyByUser,
  };
  axiosInstance
    .post("storages", novoEstoque)
    .then(() => {
      clearUseEstoque();
      showAlert(
        "success",
        "Estoque adicionado com sucesso",
        "Estoque adicionado com sucesso"
      );
    })
    .catch(() => {
      showAlert(
        "error",
        "Erro ao adicionar estoque",
        "Tente novamente mais tarde"
      );
    });
}
function clearUseEstoque() {
  useEstoque.getState().setNome("");
  useEstoque.getState().setDescricao("");
  useEstoque.getState().setQuantidade("");
  useEstoque.getState().setPrecoUnitario("");
  useEstoque.getState().setDataEntrada("");
  useEstoque.getState().setDataExpiracao("");
}

function AddEstoque(props: any) {
  const { data_entrada, data_expiracao } = useEstoque();

  function onSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (data_expiracao !== "") {
      if (data_entrada >= data_expiracao) {
        Swal.fire({
          icon: "error",
          title: "Data de expiração inválida",
          text: "A data de expiração deve ser maior que a data de entrada",
          toast: true,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        return;
      }
    }
    addEstoqueAPI();
    props.setGetDataStorage(!props.getDataStorage);
  }
  return (
    <>
      <div className="flex flex-col items-center">
        <form className="flex flex-col gap-4" onSubmit={onSubmitForm}>
          <Label htmlFor="nome">Nome</Label>
          <Input
            name="nome"
            type="text"
            placeholder="Nome"
            required
            value={useEstoque((state) => state.nome)}
            onChange={(e) => useEstoque.getState().setNome(e.target.value)}
          />
          <Label htmlFor="descricao">Descrição</Label>
          <Input
            name="descricao"
            type="text"
            required
            placeholder="Descrição"
            value={useEstoque((state) => state.descricao)}
            onChange={(e) => useEstoque.getState().setDescricao(e.target.value)}
          />
          <div className="flex flex-col items-center sm:flex-row gap-2">
            <Label htmlFor="preco_unitario">Preço Unitário</Label>
            <Input
              name="preco_unitario"
              type="number"
              required
              min={0}
              placeholder="Preço Unitário"
              value={useEstoque((state) => state.preco_unitario)}
              onChange={(e) =>
                useEstoque.getState().setPrecoUnitario(e.target.value)
              }
            />
            <Label htmlFor="quantidade">Quantidade</Label>
            <Input
              name="quantidade"
              placeholder="Quantidade"
              type="number"
              required
              min={1}
              value={useEstoque((state) => state.quantidade)}
              onChange={(e) =>
                useEstoque.getState().setQuantidade(e.target.value)
              }
            />
          </div>
          <div className="flex flex-col items-center sm:flex-row gap-2">
            <Label htmlFor="data_entrada">Data Entrada</Label>
            <Input
              name="data_entrada"
              placeholder="Entrada"
              type="date"
              required
              value={useEstoque((state) => state.data_entrada)}
              onChange={(e) =>
                useEstoque.getState().setDataEntrada(e.target.value)
              }
            />
            <Label htmlFor="data_expiracao">Data Expiração</Label>
            <Input
              name="data_expiracao"
              placeholder="Expiração"
              type="date"
              value={useEstoque((state) => state.data_expiracao)}
              onChange={(e) =>
                useEstoque.getState().setDataExpiracao(e.target.value)
              }
            />
          </div>
          <Button type="submit" variant={"outline"}>
            Adicionar
          </Button>
        </form>
      </div>
    </>
  );
}

export default AddEstoque;
