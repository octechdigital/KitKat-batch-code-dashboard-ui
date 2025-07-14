import { useEffect, useRef, useState } from "react";

function useApi<T>(apiCall: () => Promise<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [response, setResponse] = useState<T | null>(null);
  const isMounted = useRef(false);

  const fetchData = () => {
    setIsLoading(true);
    setIsError(false);
    setResponse(null);
    apiCall()
        .then((response) => {
          if (isMounted.current) {
            setResponse(response);
          }
        })
        .catch(() => {
          if (isMounted.current) {
            setIsError(true);
          }
        })
        .finally(() => {
          if (isMounted.current) {
            setIsLoading(false);
          }
        });
  };

  useEffect(() => {
    isMounted.current = true;
    fetchData();
    return () => {
      isMounted.current = false;
    };
  }, []);

  return { isError, isLoading, response, fetchData };
}

export default useApi;
