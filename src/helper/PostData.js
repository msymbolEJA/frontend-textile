import axios from "axios"

export const postData = async (path, data) => {
    const response = await axios.post(`${path}`, data, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    })
    return response
}
