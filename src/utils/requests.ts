import axios from 'axios'

const AxiosClient = axios.create({
    baseURL: '/api',
    headers: {

    },

    timeout: 15000,
})

export default AxiosClient
