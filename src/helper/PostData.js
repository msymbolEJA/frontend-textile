import axios from "axios"

export const postData = async (path, data) => {
    const token = "token";
    const response = await axios.post(`${path}`,data,{
        headers:{
            Accept: 'application/json',
           'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token // if you use token
        }
    } )
    return response?.data
}
