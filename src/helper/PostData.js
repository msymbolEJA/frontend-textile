import axios from "axios";
import FormData from "form-data";
//const token = localStorage.getItem("x-auth-token");

export const postAuthData = async (path, data) => {
  const response = await axios.post(`${path}`, data, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const postData = async (path, data) => {
  const token = localStorage.getItem("x-auth-token");
  const response = await axios.post(`${path}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const putData = async (path, data) => {
  const token = localStorage.getItem("x-auth-token");
  const response = await axios.put(`${path}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const getData = async (path) => {
  const token = localStorage.getItem("x-auth-token");
  const response = await axios.get(`${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const postFormData = async (path, dataObj) => {
  const data = new FormData();
  Object.keys(dataObj).forEach((key) => data.append(key, dataObj[key]));
  const token = localStorage.getItem("x-auth-token");
  const response = await axios.post(`${path}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const queryData = async (path) => {
  const token = localStorage.getItem("x-auth-token");
  const response = await axios.get(`${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const putImage = async (path, image, imageName) => {
  const fd = new FormData();
  fd.append("image", image, imageName);
  const token = localStorage.getItem("x-auth-token");
  const response = await axios.put(path, fd, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getOnePdf = async (path, data) => {
  const fd = new FormData();
  fd.append("a", data);
  const token = localStorage.getItem("x-auth-token");
  const response = await axios.post(path, fd, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getAllPdf = async (path, data) => {
  const token = localStorage.getItem("x-auth-token");
  const response = await axios.get(path, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const globalSearch = async (path) => {
  const token = localStorage.getItem("x-auth-token");
  const response = await axios.get(path, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const deleteProduct = async (path) => {
  const token = localStorage.getItem("x-auth-token");
  const response = await axios.delete(path, {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  });
  return response;
};
