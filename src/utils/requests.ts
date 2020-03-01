import axios from 'axios'

const AxiosClient = axios.create({
    baseURL: '/api',
    timeout: 15000,
})

export function getUserHeaders() {
    const { UserModule } = require('@/store/module')

    return {
        Authorization: `Bearer ${UserModule.token}`,
    }
}

axios.interceptors.response.use(value => value, err => Promise.resolve(err))

export default AxiosClient
