import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { ptBR } from "date-fns/locale/pt-BR";
import { endOfDay, format, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NavBar from "@/components/NavBar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/api/axiosInstance";
import { CalendarIcon, PlusIcon } from "lucide-react";
import { showAlert } from "@/components/ShowAlerts";
import CalendarComponent from "@/components/Calendar";
import { Separator } from "@/components/ui/separator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface Event {
  id: number;
  title: string;
  description: string;
  start: string;
  end: string;
  user_id: number;
  company_id: number;
}
export default function Planejamento() {
  const userJson = JSON.parse(Cookies.get("User") || "{}");
  const idCompanyByUser = userJson.company_id;
  const userId = userJson.id;
  const [dataEvents, setDataEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatDateForMySQL = (date: any) => {
    return date ? date.toISOString().slice(0, 19).replace("T", " ") : "";
  };
  const fetchEvents = () => {
    setIsLoading(true);
    axiosInstance
      .get("events/company/" + idCompanyByUser)
      .then((response) => {
        setDataEvents(response.data);
        applyFilters(); // Filtra eventos após a obtenção dos dados
      })
      .catch((err) => {
        console.log("Erro ao buscar eventos:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const putEvents = (data: Event) => {
    axiosInstance
      .put("events/" + data.id, data)
      .then(() => {
        showAlert("success", "Sucesso", "Evento editado com sucesso");
        fetchEvents();
      })
      .catch(() => {
        showAlert("error", "Erro", "Erro ao editar evento");
      });
  };
  const postEvents = (data: Event) => {
    console.log(data);
    axiosInstance
      .post("events", data)
      .then(() => {
        showAlert("success", "Sucesso", "Evento adicionado com sucesso");
        fetchEvents();
      })
      .catch((err) => {
        showAlert("error", "Erro", "Erro ao adicionar evento");
        console.log(err);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Eventos
  const [eventID, setEventID] = useState<number>(0);
  const [eventDescription, setEventDescription] = useState<string>("");
  const [eventTitle, setEventTitle] = useState<string>("");
  const [eventStart, setEventStart] = useState<Date | undefined>();
  const [eventEnd, setEventEnd] = useState<Date | undefined>();

  const handleSetEvents = (event: Event) => {
    setEventID(event.id);
    setEventDescription(event.description);
    setEventTitle(event.title);
    setEventStart(new Date(event.start));
    if (event.end) {
      setEventEnd(new Date(event.end));
    } else {
      setEventEnd(undefined);
    }
  };

  const handleEditEvent = () => {
    const data = {
      id: eventID,
      title: eventTitle,
      description: eventDescription,
      start: formatDateForMySQL(eventStart),
      end: formatDateForMySQL(eventEnd),
      user_id: parseInt(userId),
      company_id: parseInt(idCompanyByUser),
    };
    putEvents(data);
  };

  const handleDeleteEvent = (eventIDSelect: number) => {
    Swal.fire({
      title: "Você tem certeza?",
      text: "Você não poderá reverter isso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance
          .delete("events/" + eventIDSelect)
          .then(() => {
            showAlert("success", "Sucesso", "Evento deletado com sucesso");
            fetchEvents();
          })
          .catch(() => {
            showAlert("error", "Erro", "Erro ao deletar evento");
          });
      }
    });
  };
  const clearStateEvent = () => {
    setEventID(0);
    setEventDescription("");
    setEventTitle("");
    setEventStart(undefined);
    setEventEnd(undefined);
  };
  const handleAddEvent = () => {
    if (eventTitle === "") {
      showAlert("error", "Erro", "Título é obrigatório");
      return;
    }
    if (eventDescription === "") {
      showAlert("error", "Erro", "Descrição é obrigatória");
      return;
    }
    if (eventStart === undefined) {
      showAlert("error", "Erro", "Data de início é obrigatória");
      return;
    }
    eventStart?.setHours(23, 59, 59);
    eventEnd?.setHours(23, 59, 59);

    const data = {
      title: eventTitle,
      description: eventDescription,
      start: eventStart?.toISOString().split("T")[0] ?? "",
      end: eventEnd?.toISOString().split("T")[0] ?? "",
      user_id: parseInt(userId),
      company_id: parseInt(idCompanyByUser),
    };
    postEvents(data as Event);
    clearStateEvent();
  };

  // Filtros
  const [filterTitle, setFilterTitle] = useState<string>("");
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>();
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const handleClearFilters = () => {
    setFilterTitle("");
    setFilterStartDate(undefined);
    setFilterEndDate(undefined);
    fetchEvents();
  };
  const applyFilters = () => {
    let results = [...dataEvents];

    // Verifica se não há filtros aplicados
    if (!filterTitle && !filterStartDate && !filterEndDate) {
      const today = startOfDay(new Date());

      // Filtra eventos a partir do dia de hoje para frente
      results = results.filter(
        // Use start date if end date is not defined
        (event) => {
          const eventStartDate = startOfDay(new Date(event.start));
          const eventEndDate = endOfDay(new Date(event.end || event.start)); // Use start date if end date is not defined
          return (
            (eventStartDate <= today && eventEndDate >= today) ||
            eventStartDate >= today
          );
        }

        // startOfDay(new Date(event.start)) >= today
      );
    } else {
      // Aplica filtros existentes
      if (filterTitle) {
        results = results.filter((event) =>
          event.title.toLowerCase().includes(filterTitle.toLowerCase())
        );
      }
      if (filterStartDate || filterEndDate) {
        results = results.filter((event) => {
          const eventStartDate = startOfDay(new Date(event.start));
          const eventEndDate = endOfDay(new Date(event.end || event.start));

          const filterStart = filterStartDate
            ? startOfDay(filterStartDate)
            : undefined;
          const filterEnd = filterEndDate ? endOfDay(filterEndDate) : undefined;

          // Verifica se há sobreposição entre o intervalo do evento e o intervalo do filtro
          const isOverlapping =
            (!filterStart || eventEndDate >= filterStart) &&
            (!filterEnd || eventStartDate <= filterEnd);

          return isOverlapping;
        });
      }
    }

    setFilteredEvents(results);
  };

  useEffect(() => {
    applyFilters();
  }, [dataEvents]);
  return (
    <>
      <NavBar title="Planejamento" />
      <div className="flex flex-col sm:flex-row w-full gap-4">
        <div className="flex w-full sm:w-1/4 justify-center">
          <Card className="w-full">
            <CardHeader>
              <div className="flex flex-row w-full justify-between items-center">
                <CardTitle>Eventos</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Separator />
              <div className="flex flex-row justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant={"outline"}
                      onClick={() => clearStateEvent()}
                    >
                      <PlusIcon className="h-4 w-4" />
                      Evento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-full">
                    <DialogHeader>
                      <DialogTitle>Adicione um evento.</DialogTitle>
                      <DialogDescription>
                        Preencha os campos abaixo para adicionar um evento.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-3">
                      <p className="font-bold">Título:</p>
                      <Input
                        className="w-full"
                        id="titleADD"
                        type="text"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                      />
                      <p className="font-bold">Descrição:</p>
                      <Input
                        className="w-full"
                        id="descriptionADD"
                        type="text"
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                      />
                      <p className="font-bold">Data Início:</p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {eventStart
                              ? format(eventStart, "dd/MM/yyyy")
                              : "Início"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0"
                          side="top"
                          align="center"
                        >
                          <Calendar
                            id="startADD"
                            locale={ptBR}
                            mode="single"
                            selected={eventStart}
                            onSelect={setEventStart}
                            defaultMonth={eventStart}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="font-bold">Data Fim:</p>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {eventEnd ? format(eventEnd, "dd/MM/yyyy") : "Fim"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0"
                          side="top"
                          align="center"
                        >
                          <Calendar
                            id="endADD"
                            locale={ptBR}
                            mode="single"
                            selected={eventEnd}
                            onSelect={setEventEnd}
                            defaultMonth={eventEnd}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Button
                      className="w-auto"
                      variant={"default"}
                      onClick={() => {
                        handleAddEvent();
                      }}
                    >
                      Adicionar
                    </Button>
                  </DialogContent>
                </Dialog>
                <Drawer direction="right">
                  <DrawerTrigger asChild>
                    <Button variant="outline">Filtros</Button>
                  </DrawerTrigger>
                  <DrawerContent className="flex flex-col h-full items-center  w-auto justify-center sm:ml-[50%]">
                    <div className="flex flex-col w-auto m-auto">
                      <DrawerHeader>
                        <DrawerTitle className="sr-only">Filtros</DrawerTitle>
                        <DrawerDescription className="sr-only">
                          Aplique filtros para encontrar eventos específicos
                        </DrawerDescription>
                      </DrawerHeader>

                      <div className="grid gap-4 ">
                        <p className="font-bold text-2xl">Filtrar Eventos</p>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <label htmlFor="titleFILTER" className="font-bold">
                            Título:
                          </label>
                          <Input
                            id="titleFILTER"
                            className="w-3/4"
                            type="text"
                            value={filterTitle}
                            onChange={(e) => setFilterTitle(e.target.value)}
                            placeholder="Filtrar por título"
                          />
                        </div>
                        <div className="flex justify-between">
                          <label htmlFor="startFILTER" className="font-bold">
                            Data Início:
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-3/4">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {filterStartDate
                                  ? format(filterStartDate, "dd/MM/yyyy")
                                  : "Início"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              side="top"
                              align="center"
                            >
                              <Calendar
                                id="startFILTER"
                                locale={ptBR}
                                mode="single"
                                selected={filterStartDate}
                                onSelect={setFilterStartDate}
                                defaultMonth={filterStartDate}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="flex flex-row justify-between">
                          <label htmlFor="endFILTER" className="font-bold">
                            Data Fim:
                          </label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-3/4">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {filterEndDate
                                  ? format(filterEndDate, "dd/MM/yyyy")
                                  : "Fim"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              side="top"
                              align="center"
                            >
                              <Calendar
                                id="endFILTER"
                                locale={ptBR}
                                mode="single"
                                selected={filterEndDate}
                                onSelect={setFilterEndDate}
                                defaultMonth={filterEndDate}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                      <DrawerFooter className="flex flex-row">
                        <Button
                          variant="default"
                          onClick={() => applyFilters()}
                        >
                          Aplicar Filtros
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleClearFilters()}
                        >
                          Limpar Filtros
                        </Button>
                        <DrawerClose>
                          <Button variant="default" className="w-full">
                            Cancelar
                          </Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>
              <Separator />
              {isLoading && <p>Carregando...</p>}
              {filteredEvents?.map((event: Event) => (
                <div key={event.id} className="grid  flex-col gap-4">
                  <div className="flex flex-row justify-between items-center mb-2">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <span>{event.title}</span>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <p className="font-bold">{event.title}</p>
                        <Separator />
                        <p>{event.description}</p>
                        <p>
                          Data Início:{" "}
                          {format(new Date(event.start), "dd/MM/yyyy")}
                        </p>
                        <p>
                          Data Fim:{" "}
                          {event.end
                            ? format(new Date(event.end), "dd/MM/yyyy")
                            : "Indefinido"}
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                    <div className="flex flex-row justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="text-sm"
                            variant="outline"
                            onClick={() => {
                              handleSetEvents(event);
                            }}
                          >
                            Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-fit">
                          <DialogHeader>
                            <DialogTitle className="text-sm">
                              Editar Evento
                            </DialogTitle>
                            <DialogDescription></DialogDescription>
                          </DialogHeader>
                          <div className="flex items-center space-x-2">
                            <div className="grid gap-3">
                              <p className="font-bold">Título</p>
                              <Input
                                id="titleEDIT"
                                type="text"
                                value={eventTitle}
                                onChange={(e) => setEventTitle(e.target.value)}
                              />
                              <p className="font-bold">Descrição</p>
                              <Input
                                id="descriptionEDIT"
                                type="text"
                                value={eventDescription}
                                onChange={(e) =>
                                  setEventDescription(e.target.value)
                                }
                              />
                              <p className="font-bold">Início</p>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {eventStart
                                      ? format(eventStart, "dd/MM/yyyy")
                                      : "Início"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  side="top"
                                  align="center"
                                >
                                  <Calendar
                                    id="startEDIT"
                                    locale={ptBR}
                                    mode="single"
                                    selected={eventStart}
                                    onSelect={setEventStart}
                                    initialFocus
                                    defaultMonth={eventStart}
                                  />
                                </PopoverContent>
                              </Popover>
                              <p className="font-bold">Fim</p>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {eventEnd
                                      ? format(eventEnd, "dd/MM/yyyy")
                                      : "Fim"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  side="top"
                                  align="center"
                                >
                                  <Calendar
                                    id="endEDIT"
                                    locale={ptBR}
                                    mode="single"
                                    selected={eventEnd}
                                    onSelect={setEventEnd}
                                    defaultMonth={eventEnd}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                          <Button
                            className="w-auto"
                            variant={"default"}
                            onClick={() => {
                              handleEditEvent();
                            }}
                          >
                            Salvar
                          </Button>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleDeleteEvent(event.id);
                        }}
                      >
                        Deletar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="flex w-full sm:w-3/4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Calendário de Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent events={dataEvents} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
