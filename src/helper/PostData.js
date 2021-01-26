import axios from "axios";
import FormData from "form-data";

export const postData = async (path, data) => {
  const response = await axios.post(`${path}`, data, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const putData = async (path, data) => {
  const response = await axios.put(`${path}`, data, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const getData = async (path, data) => {
  const response = await axios.get(`${path}`, data, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return response;
};

export const postFormData = async (path, dataObj) => {
  const data = new FormData();
  console.log("data1", data);
  Object.keys(dataObj).forEach((key) => data.append(key, dataObj[key]));

  console.log("data", data);
  const response = await axios.post(`${path}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const queryData = async (path) => {
  const response = await axios.get(`${path}`);
  return response;
};

export const putImage = async (path, image, imageName) => {
  const fd = new FormData();
  fd.append("Image", image, imageName);
  const response = await axios.put(path, fd);
  return response;
};

export const getOnePdf = async (path, data) => {
  const fd = new FormData();
  fd.append("a", 2);
  const response = await axios.post(path, fd);
  return response;
};

export const getAllPdf = async (path, data) => {
  const response = await axios.get(path);
  return response;
};

export const globalSearch = async (path) => {
  const response = await axios.get(path);
  return response;
};
