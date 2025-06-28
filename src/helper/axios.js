import axios from 'axios';

let setGlobalLoading = null;

export const registerLoaderSetter = setter => {
  setGlobalLoading = setter;
};

const api = axios; // `axios.create()` yerine doğrudan axios

api.interceptors.request.use(config => {
  if (setGlobalLoading) setGlobalLoading(true);

  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, error => {
  if (setGlobalLoading) setGlobalLoading(false);
  return Promise.reject(error);
});

api.interceptors.response.use(response => {
  if (setGlobalLoading) setGlobalLoading(false);
  return response;
}, error => {
  if (setGlobalLoading) setGlobalLoading(false);
  return Promise.reject(error);
});

export default api;
