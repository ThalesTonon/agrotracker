import { useAxiosGet } from "@/api/useAxios";

type Event = {
  id: number;
  title: string;
  description: string;
  start: string;
  end: string;
  user_id: number;
  created_at: string;
  updated_at: string;
};

export default function Home() {
  const { data, isLoading } = useAxiosGet<Event[]>("events");

  return (
    <div>
      <h1>Home</h1>
      {isLoading && <p>Carregando...</p>}
      {data && data.length > 0 ? (
        <ul>
          {data.map((event) => (
            <li key={event.id}>
              <strong>{event.title}</strong> - {event.description} (
              {event.start} até {event.end})
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum evento encontrado.</p>
      )}
    </div>
  );
}
