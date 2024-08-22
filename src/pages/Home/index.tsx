import { useAxiosGet } from "@/api/useAxios";

type User = {
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
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
