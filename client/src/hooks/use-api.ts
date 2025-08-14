import { api } from "@/api/api";
import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";

type HttpMethod = "get" | "post" | "put" | "delete";

type HttpOptions = {
  method: HttpMethod;
  body?: unknown;
};

export function useApi<TData = unknown, TBody = unknown>(
  uri: string,
  options: HttpOptions = {
    method: "get",
  },
) {
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const fetchData = useCallback(
    async (body?: TBody) => {
      try {
        setIsLoading(true);
        setError(null);
        setIsError(false);
        setIsSuccess(false);

        const response = await (body
          ? api[options.method]<TData>(uri, body)
          : api[options.method]<TData>(uri));

        setData(response.data);
        setIsSuccess(true);
        return response.data;
      } catch (error) {
        setIsError(true);
        setData(null);
        if (error instanceof AxiosError) {
          // Extract the error message from the backend response if available
          const backendError = error.response?.data;
          setError({
            ...error,
            message: backendError?.message || error.message,
          });
        }
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [uri, options.method],
  );

  useEffect(() => {
    if (isSuccess) {
      setIsSuccess(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (options.method === "get") {
      fetchData();
    }
  }, [fetchData, options.method]);

  return {
    data,
    isLoading,
    isError,
    error,
    isSuccess,
    mutate: fetchData,
  };
}
