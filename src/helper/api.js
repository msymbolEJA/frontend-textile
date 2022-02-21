import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const localStoragePrefix = process.env.REACT_APP_STORE_NAME_ORJ + "-";

const api = async (url, method, data = null) => {
  const token = localStorage.getItem(localStoragePrefix + "x-auth-token");
  const axiosResponse = axios({
    method,
    url: `${BASE_URL}${url}`,
    data,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return axiosResponse;
};

export default api;
