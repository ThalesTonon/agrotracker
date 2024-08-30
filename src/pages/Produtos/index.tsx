import NavBar from "@/components/NavBar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { axiosInstance } from "@/api/axiosInstance";
import Cookies from "js-cookie";
import { showAlert } from "@/components/ShowAlerts";
import Swal from "sweetalert2";
const productsSelect = [
  {
    group: "Açúcar",
    items: [
      { Value: "50", Label: "Açúcar - AL" },
      { Value: "149", Label: "Açúcar - PB" },
      { Value: "35", Label: "Açúcar - PE" },
      { Value: "143", Label: "Açúcar - Santos" },
      { Value: "53", Label: "Açúcar - SP" },
    ],
  },
  {
    group: "Algodão",
    items: [{ Value: "54", Label: "Algodão" }],
  },
  {
    group: "Arroz",
    items: [{ Value: "91", Label: "Arroz" }],
  },
  {
    group: "Bezerro",
    items: [
      { Value: "8", Label: "Bezerro - MS" },
      { Value: "3", Label: "Bezerro - SP" },
    ],
  },
  {
    group: "Boi",
    items: [{ Value: "2", Label: "Boi Gordo" }],
  },
  {
    group: "Café",
    items: [
      { Value: "23", Label: "Café Arábica" },
      { Value: "24", Label: "Café Robusta" },
    ],
  },
  {
    group: "Citros",
    items: [{ Value: "162", Label: "Citros" }],
  },
  {
    group: "Etanol Anidro",
    items: [
      { Value: "208", Label: "Etanol Anidro - AL" },
      { Value: "75", Label: "Etanol Anidro - MT" },
      { Value: "211", Label: "Etanol Anidro - PB" },
      { Value: "101", Label: "Etanol Anidro - PE" },
      { Value: "104", Label: "Etanol Anidro - SP" },
    ],
  },
  {
    group: "Etanol Hidratado",
    items: [
      { Value: "209", Label: "Etanol Hidratado - AL" },
      { Value: "119", Label: "Etanol Hidratado - GO" },
      { Value: "76", Label: "Etanol Hidratado - MT" },
      { Value: "210", Label: "Etanol Hidratado - PB" },
      { Value: "100", Label: "Etanol Hidratado - PE" },
      { Value: "103", Label: "Etanol Hidratado - SP" },
    ],
  },
  {
    group: "Frango",
    items: [
      { Value: "181", Label: "Frango Congelado" },
      { Value: "130", Label: "Frango Resfriado" },
    ],
  },
  {
    group: "Leite",
    items: [{ Value: "leitep", Label: "Leite" }],
  },
  {
    group: "Mandioca",
    items: [{ Value: "72", Label: "Mandioca" }],
  },
  {
    group: "Milho",
    items: [{ Value: "77", Label: "Milho" }],
  },
  {
    group: "Ovino",
    items: [
      { Value: "305-BA", Label: "Ovino - BA" },
      { Value: "305-CE", Label: "Ovino - CE" },
      { Value: "305-MS", Label: "Ovino - MS" },
      { Value: "305-MT", Label: "Ovino - MT" },
      { Value: "305-PR", Label: "Ovino - PR" },
      { Value: "305-RS", Label: "Ovino - RS" },
      { Value: "305-SP", Label: "Ovino - SP" },
    ],
  },
  {
    group: "Ovos Brancos",
    items: [
      {
        Value: "159-Bastos (SP) - FOB-branco",
        Label: "Ovos Brancos - Bastos (SP) - FOB",
      },
      {
        Value: "159-Grande BH - (MG) - CIF-branco",
        Label: "Ovos Brancos - Grande BH - (MG) - CIF",
      },
      {
        Value: "159-Grande SP (SP) - CIF-branco",
        Label: "Ovos Brancos - Grande SP (SP) - CIF",
      },
      {
        Value: "159-Recife (PE) - CIF-branco",
        Label: "Ovos Brancos - Recife (PE) - CIF",
      },
      {
        Value: "159-S. M. de Jetibá (ES) - FOB-branco",
        Label: "Ovos Brancos - S. M. de Jetibá (ES) - FOB",
      },
    ],
  },
  {
    group: "Ovos Vermelhos",
    items: [
      {
        Value: "159-Bastos (SP) - FOB-vermelho",
        Label: "Ovos Vermelhos - Bastos (SP) - FOB",
      },
      {
        Value: "159-Grande BH - (MG) - CIF-vermelho",
        Label: "Ovos Vermelhos - Grande BH - (MG) - CIF",
      },
      {
        Value: "159-Grande SP (SP) - CIF-vermelho",
        Label: "Ovos Vermelhos - Grande SP (SP) - CIF",
      },
      {
        Value: "159-Recife (PE) - CIF-vermelho",
        Label: "Ovos Vermelhos - Recife (PE) - CIF",
      },
      {
        Value: "159-S. M. de Jetibá (ES) - FOB-vermelho",
        Label: "Ovos Vermelhos - S. M. de Jetibá (ES) - FOB",
      },
    ],
  },
  {
    group: "Soja",
    items: [
      { Value: "12", Label: "Soja - PR" },
      { Value: "92", Label: "Soja Paranaguá" },
    ],
  },
  {
    group: "Suíno",
    items: [
      { Value: "129-10", Label: "Suíno - MG" },
      { Value: "129-6", Label: "Suíno - PR" },
      { Value: "129-4", Label: "Suíno - RS" },
      { Value: "129-5", Label: "Suíno - SC" },
      { Value: "129-1", Label: "Suíno - SP" },
      { Value: "124", Label: "Suíno - carcaça especial" },
    ],
  },
  {
    group: "Tilápia",
    items: [
      { Value: "349-GL", Label: "Tilápia - Grandes Lagos" },
      { Value: "349-NP", Label: "Tilápia - Norte do Paraná" },
      { Value: "349-OP", Label: "Tilápia - Oeste do Paraná" },
      { Value: "349-MG", Label: "Tilápia - Morada Nova de Minas" },
      {
        Value: "349-TA",
        Label: "Tilápia - Triângulo Mineiro e Alto Paranaíba",
      },
    ],
  },
  {
    group: "Trigo",
    items: [
      { Value: "178", Label: "Trigo - PR" },
      { Value: "179", Label: "Trigo - RS" },
    ],
  },
];
type itemTypes = { Id: number; Value: string; Label: string };

export default function Produtos() {
  const userJson = JSON.parse(Cookies.get("User") || "{}");
  const companyID = userJson.company_id;

  // Variáveis de estado para o seletor de produtos
  const [selectedGroup, setSelectedGroup] = useState("");
  const [filteredItems, setFilteredItems] = useState<itemTypes[]>([]);
  const [selectedItem, setSelectedItem] = useState<itemTypes | null>(null);
  const [productList, setProductList] = useState<itemTypes[]>([]);
  const [companyProducts, setCompanyProducts] = useState<itemTypes[]>([]);

  // Handler para mudanças no select de grupos
  const handleGroupChange = (value: string) => {
    setSelectedGroup(value);
    const group = productsSelect.find((g) => g.group === value);
    if (group) {
      setFilteredItems(
        group.items.map((item, index) => ({ Id: index, ...item }))
      );
      console.log(group.items);
    } else {
      setFilteredItems([]);
    }
  };
  const handleItemChange = (value: string) => {
    const item = filteredItems.find((i) => i.Value === value);
    if (item) {
      setSelectedItem(item);
    }
  };

  const handleAddProduct = () => {
    if (selectedItem) {
      if (productList.some((p) => p.Value === selectedItem.Value)) {
        return;
      }
      if (companyProducts.some((p) => p.Value === selectedItem.Value)) {
        showAlert(
          "error",
          "Produto já adicionado",
          "O produto já está sendo monitorado"
        );
        return;
      }
      const exists = companyProducts.some((product) => {
        return product.Value == selectedItem.Value;
      });
      if (exists) {
        showAlert(
          "error",
          "Produto já adicionado",
          "O produto já está sendo monitorado"
        );
      } else {
        showAlert(
          "success",
          "Produto adicionado",
          "Produto adicionado com sucesso"
        );
        setProductList([...productList, selectedItem]);
        setSelectedGroup(""); // Reset selected group to default
        setFilteredItems([]);
        setSelectedItem(null); // Reset selected item to default
      }
    }
  };
  const handleRemoveItem = (item: itemTypes) => {
    const newProductList = productList.filter((p) => p.Value !== item.Value);
    setProductList(newProductList);
  };

  const handleSaveProducts = () => {
    if (productList.length === 0) {
      showAlert(
        "error",
        "Nenhum produto adicionado",
        "Adicione produtos para salvar"
      );
      return;
    }
    console.log("Lista de produtos a serem salvos", productList);
    axiosInstance
      .post("products/" + companyID, productList)
      .then(() => {
        showAlert("success", "Produtos salvos", "Produtos salvos com sucesso");
        fetchCompanyProducts();
        setProductList([]);
      })
      .catch(() => {
        showAlert(
          "error",
          "Erro ao salvar produtos",
          "Erro ao salvar produtos, tente novamente mais tarde"
        );
      });
  };
  const handleDeleteProductCompany = (product: itemTypes) => {
    console.log("Deletar produto", product.Id);
    Swal.fire({
      title: "Deletar produto",
      text: "Tem certeza que deseja deletar esse produto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProductCompany(product);
      }
    });
  };
  const deleteProductCompany = (product: itemTypes) => {
    axiosInstance
      .delete("products/" + product.Id)
      .then(() => {
        showAlert(
          "success",
          "Produto deletado",
          "Produto deletado com sucesso"
        );
        fetchCompanyProducts();
      })
      .catch(() => {
        showAlert(
          "error",
          "Erro ao deletar produto",
          "Erro ao deletar produto, tente novamente mais tarde"
        );
      });
  };

  //Company products
  const fetchCompanyProducts = async () => {
    axiosInstance.get("products/" + companyID).then((response) => {
      console.log(response.data);
      setCompanyProducts(response.data);
    });
  };
  useEffect(() => {
    fetchCompanyProducts();
  }, []);

  // Widget
  const [widgetHtml, setWidgetHtml] = useState("");

  useEffect(() => {
    const fetchWidget = async () => {
      try {
        const screenWidth = window.innerWidth;
        const width = screenWidth > 400 ? "700px" : `${screenWidth - 200}px`;

        // Gera a string de indicadores para a URL
        const indicadores = companyProducts
          .map((product) => `&id_indicador%5B%5D=${product.Value}`)
          .join("");

        const url = `https://www.cepea.esalq.usp.br/br/widgetproduto.js.php?fonte=arial&tamanho=10&largura=${width}&corfundo=dbd6b2&cortexto=333333&corlinha=ede7bf${indicadores}`;
        console.log("URL do widget:", url);

        const response = await fetch(url);
        const scriptText = await response.text();

        // Captura o conteúdo gerado pelo document.write
        const scriptFunction = new Function(
          "document",
          scriptText + "; return document.output;"
        );
        const mockDocument = {
          output: "",
          write: function (html: string) {
            this.output += html;
          },
        };

        const resultHtml = scriptFunction(mockDocument);
        setWidgetHtml(resultHtml);
      } catch (error) {
        console.error("Error fetching widget:", error);
      }
    };

    fetchWidget();
  }, [companyProducts]);

  return (
    <>
      <NavBar title="Produtos" />
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="sr-only">Grupo de Produtos</CardTitle>
          <CardDescription>
            Adicione os produtos que queira monitorar.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          <div className="flex flex-col sm:flex-row gap-4 ">
            <div className="flex sm:flex-row flex-col gap-4 sm:w-1/2">
              <div className="grid gap-2 sm:w-1/2">
                <p className="font-bold text-xl">Grupos</p>
                <div className="mr-8">
                  <Select
                    onValueChange={handleGroupChange}
                    value={selectedGroup}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um Grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      {productsSelect.map((group) => (
                        <SelectItem key={group.group} value={group.group}>
                          {group.group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2 sm:w-1/2">
                <p className="font-bold text-xl">Itens</p>
                <div className="mr-8">
                  <Select
                    disabled={!selectedGroup}
                    onValueChange={handleItemChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um Item" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredItems.map((item) => (
                        <SelectItem key={item.Value} value={item.Value}>
                          {item.Label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex flex-row w-1/2 items-end">
              <Button
                variant="default"
                size="default"
                onClick={handleAddProduct}
              >
                Adicionar
              </Button>
            </div>
          </div>
          {productList.length !== 0 && (
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex flex-row w-full">
                <p className="font-bold text-xl w-full">Produtos Adicionados</p>
                <div className="flex flex-row w-full justify-end">
                  <Button
                    variant="default"
                    size="default"
                    onClick={() => setProductList([])}
                  >
                    Limpar
                  </Button>
                  <Button
                    variant="default"
                    size="default"
                    onClick={() => handleSaveProducts()}
                    className="ml-4"
                  >
                    Salvar Produtos
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {productList.map((product) => (
                  <div
                    key={product.Value}
                    className="bg-gray-200 p-2 rounded-lg"
                  >
                    {product.Label}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="ml-4"
                      onClick={() => handleRemoveItem(product)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle>Produtos Monitorados</CardTitle>
          <CardDescription>Produtos que a empresa já monitora.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          {companyProducts.length !== 0 && (
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex flex-row w-full">
                <p className="font-bold text-xl w-full">Produtos:</p>
                <div className="flex flex-row w-full justify-end">
                  <Button
                    variant="default"
                    size="default"
                    onClick={() => fetchCompanyProducts()}
                  >
                    Atualizar
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                {companyProducts.map((product) => (
                  <div
                    key={product.Value}
                    className="bg-gray-200 p-2 rounded-lg"
                  >
                    {product.Value} - {product.Label}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="ml-4"
                      onClick={() => handleDeleteProductCompany(product)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      <Card className="w-full mt-4">
        <CardHeader>
          <CardTitle>Preços</CardTitle>
          <CardDescription>Preços dos produtos monitorados.</CardDescription>
        </CardHeader>
        <CardContent className="grid justify-center">
          <div dangerouslySetInnerHTML={{ __html: widgetHtml }} />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
}
