import { axiosInstance } from "./axiosInstance";
import { useState, useEffect } from "react";

export function useAxiosGet<T = unknown>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    axiosInstance
      .get(url)
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  console.log(data);
  return { data, error, isLoading };
}
