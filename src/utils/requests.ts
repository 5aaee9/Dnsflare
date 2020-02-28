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

export default AxiosClient
