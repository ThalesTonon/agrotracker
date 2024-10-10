import { axiosInstance } from "@/api/axiosInstance";
import NavBar from "@/components/NavBar";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  MoreHorizontal,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import AddEstoque from "./addEstoque";
import { Badge } from "@/components/ui/badge";
import { showAlert } from "@/components/ShowAlerts";
import { Label } from "@/components/ui/label";
import Cookies from "js-cookie";

export type StorageType = {
  id: number;
  name: string;
  description: string;
  quantity: string;
  unitary_value: string;
  entry_date: string;
  expiration_date: string;
  company_id: number;
  created_at: string;
  updated_at: string;
};
function SortableHeader({ column, title }: { column: any; title: string }) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {title}
      {column.getIsSorted() === "asc" && <ArrowUp className="ml-2 h-4 w-4" />}
      {column.getIsSorted() === "desc" && (
        <ArrowDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}
export default function Estoque() {
  const userJson = JSON.parse(Cookies.get("User") || "{}");
  const columns: ColumnDef<StorageType>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column} title="Nome" />,
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <SortableHeader column={column} title="Descrição" />
      ),
      cell: ({ row }) => <div>{row.getValue("description")}</div>,
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <SortableHeader column={column} title="Quantidade" />
      ),
      cell: ({ row }) => <div>{row.getValue("quantity")}</div>,
    },
    {
      accessorKey: "unitary_value",
      header: ({ column }) => (
        <SortableHeader column={column} title="Preço Unitário" />
      ),
      cell: ({ row }) => <div>{row.getValue("unitary_value")}</div>,
    },
    {
      accessorKey: "entry_date",
      header: ({ column }) => (
        <SortableHeader column={column} title="Data de Entrada" />
      ),
      cell: ({ row }) => <div>{row.getValue("entry_date")}</div>,
    },
    {
      accessorKey: "expiration_date",
      header: ({ column }) => (
        <SortableHeader column={column} title="Data de Expiração" />
      ),
      cell: ({ row }) => <div>{row.getValue("expiration_date")}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const storage = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu ações</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEditClick(storage)}>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteClick(storage.id)}>
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const fetchStorages = async () => {
    const response = await axiosInstance.get(
      "storages/company/" + userJson.company_id
    );
    return response.data;
  };
  const fetchExpireStorages = async () => {
    const response = await axiosInstance.get(
      "storages/" + userJson.company_id + "/expiring"
    );
    return response.data;
  };
  const handleDeleteClick = (id: number) => {
    Swal.fire({
      title: "Deseja excluir este registro?",
      showDenyButton: true,
      confirmButtonText: `Sim`,
      denyButtonText: `Não`,
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete(`storages/${id}`)
          .then(() => {
            Swal.fire("Registro excluído com sucesso!", "", "success");
            fetchStorages().then((data) => setData(data));
          })
          .catch(() => {
            Swal.fire("Erro ao excluir registro", "", "error");
          });
      }
    });
  };
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState<StorageType | null>(
    null
  );
  // Função para converter de "dd/mm/yyyy" para "yyyy-mm-dd" (formato aceito pelo input de data)
  const toInputDateFormat = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleEditClick = (storage: StorageType) => {
    setSelectedStorage({
      ...storage,
      entry_date: storage.entry_date
        ? toInputDateFormat(storage.entry_date)
        : "", // Converte para "yyyy-mm-dd"
      expiration_date: storage.expiration_date
        ? toInputDateFormat(storage.expiration_date)
        : "",
    });
    setIsEditModalOpen(true);
  };
  const handleUpdateStorage = () => {
    if (!selectedStorage) return;
    if (selectedStorage.entry_date >= selectedStorage.expiration_date) {
      showAlert(
        "error",
        "Data de expiração inválida",
        "A data de expiração deve ser maior que a data de entrada"
      );
      return;
    }
    axiosInstance
      .put("storages/" + selectedStorage?.id, {
        name: selectedStorage?.name,
        description: selectedStorage?.description,
        unitary_value: parseFloat(selectedStorage?.unitary_value),
        entry_date: selectedStorage?.entry_date,
        expiration_date: selectedStorage?.expiration_date,
        company_id: selectedStorage?.company_id,
      })
      .then(() => {
        showAlert("success", "Atualizado com sucesso", "Estoque atualizado");
        setIsEditModalOpen(false);
        fetchStorages().then((data) => setData(data));
        setGetDataStorage(!getDataStorage);
      })
      .catch(() => {
        showAlert("error", "Erro ao atualizar", "Tente novamente mais tarde");
      });
  };

  const [data, setData] = useState<StorageType[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [expiringStorages, setExpiringStorages] = useState<StorageType[]>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const [getDataStorage, setGetDataStorage] = useState(false);

  useEffect(() => {
    fetchStorages().then(setData);
    fetchExpireStorages().then(setExpiringStorages);
  }, [getDataStorage]);

  return (
    <div>
      <NavBar title="Estoque" />
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Estoque</DialogTitle>
            <DialogDescription>Verifique os campos abaixo:</DialogDescription>
          </DialogHeader>
          {selectedStorage && (
            <div className="flex flex-col gap-4">
              <Label htmlFor="nome">Nome</Label>
              <Input
                placeholder="Nome"
                value={selectedStorage.name}
                onChange={(e) =>
                  setSelectedStorage({
                    ...selectedStorage,
                    name: e.target.value,
                  })
                }
              />
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                placeholder="Descrição"
                value={selectedStorage.description}
                onChange={(e) =>
                  setSelectedStorage({
                    ...selectedStorage,
                    description: e.target.value,
                  })
                }
              />
              <div className="flex flex-col sm:items-center sm:flex-row gap-2">
                <Label htmlFor="preco_unitario">Preço Unitário</Label>
                <Input
                  placeholder="Valor Unitário"
                  value={selectedStorage.unitary_value}
                  onChange={(e) =>
                    setSelectedStorage({
                      ...selectedStorage,
                      unitary_value: e.target.value,
                    })
                  }
                />
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  placeholder="Quantidade"
                  value={selectedStorage.quantity}
                  onChange={(e) =>
                    setSelectedStorage({
                      ...selectedStorage,
                      quantity: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-col sm:items-center sm:flex-row gap-2">
                <Label htmlFor="data_entrada">Data Entrada</Label>
                <Input
                  name="data_entrada"
                  placeholder="Entrada"
                  type="date"
                  required
                  value={
                    selectedStorage?.entry_date
                      ? new Date(selectedStorage.entry_date)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setSelectedStorage({
                      ...selectedStorage,
                      entry_date: e.target.value,
                    })
                  }
                />
                <Label htmlFor="data_expiracao">Data Expiração</Label>
                <Input
                  type="date"
                  placeholder="Data de Expiração"
                  value={selectedStorage.expiration_date}
                  onChange={(e) =>
                    setSelectedStorage({
                      ...selectedStorage,
                      expiration_date: e.target.value,
                    })
                  }
                />
              </div>
              <Button onClick={handleUpdateStorage}>Atualizar</Button>
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <div className="w-full flex gap-4 items-center">
        <p className="text-lg font-semibold">
          Produto que vai expirar em 7 dias:
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-8 w-8 p-0">
              <Badge>{expiringStorages.length}</Badge>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Produtos</DialogTitle>
              <DialogDescription>
                Produtos que vão expirar em 7 dias
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-between">
              <p>Nome</p>
              <p>Data de Expiração</p>
            </div>
            {expiringStorages.map((storage) => (
              <div key={storage.id} className="flex justify-between">
                <p>{storage.name}</p>
                <p>
                  {new Date(storage.expiration_date).toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
              </div>
            ))}
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filtrar nomes..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm mr-4"
          />
          <Dialog>
            <DialogTrigger className="flex gap-2">
              <PlusCircle /> Estoque
            </DialogTrigger>
            <DialogContent className="w-1/2 sm:w-full">
              <DialogHeader>
                <DialogTitle>Adicione um novo item ao estoque</DialogTitle>
                <DialogDescription>
                  Verifique os campos abaixo:
                </DialogDescription>
              </DialogHeader>
              <AddEstoque
                setGetDataStorage={setGetDataStorage}
                getDataStorage={getDataStorage}
              />
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Colunas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id === "name" ? "Nome" : null}
                      {column.id === "description" ? "Descrição" : null}
                      {column.id === "quantity" ? "Quantidade" : null}
                      {column.id === "unitary_value" ? "Preço Unitário" : null}
                      {column.id === "entry_date" ? "Data de Entrada" : null}
                      {column.id === "expiration_date"
                        ? "Data de Expiração"
                        : null}

                      {column.id === "actions" ? "Ações" : null}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Sem registros
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center justify-start space-x-2 py-4">
            <p>
              {table.getRowModel().rows?.length} de {data.length} registros
            </p>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Próximo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
