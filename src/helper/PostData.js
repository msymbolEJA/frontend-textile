import axios from "axios"
import  FormData from 'form-data';

export const postData = async (path, data) => {
    const response = await axios.post(`${path}`, data, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
    return response
}

export const putData = async(path,data) => {
    const response = await axios.put(`${path}`, data, {
        headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
    return response
}

export const getData = async(path,data) => {
    const response = await axios.get(`${path}`, data, {
        headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
    return response
}

export  const postFormData = async (path, dataObj) =>  {
    const data = new FormData();
    console.log("data1",data)
    Object.keys(dataObj).forEach(key => data.append(key, dataObj[key]));

    console.log("data",data)
    const response = await axios.post(`${path}`, data, {
      headers:{
        'Content-Type': 'multipart/form-data'
      }
  })
  return response
}

export const queryData = async (path) => {
    const response = await axios.get(`${path}`)
    return response
}