import { useState, useEffect } from "react";
import api from "./api";

const useFetch = (url, initVal) => {
  const [response, setResponse] = useState(initVal);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api(url, "get")
      .then((data) => {
        // console.log("useFetch", data);
        setResponse(data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [url]);

  return { response, error, loading, setLoading };
};

export default useFetch;
