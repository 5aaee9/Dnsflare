import axios from 'axios'
import { useUserStore } from '@/store/user'


const noAuthClient = axios.create({
    baseURL: '/api',
    timeout: 15000,
})

noAuthClient.interceptors.response.use(value => value, err => Promise.resolve(err))

function useAxios() {
    const userStore = useUserStore()

    function getUserHeaders() {
        if (userStore.type === 'token') {
            return {
                Authorization: `Bearer ${userStore.token}`,
            }
        } else {
            return {
                'X-Auth-Key': userStore.globalToken,
                'X-Auth-Email': userStore.email,
            }
        }
    }

    const AxiosClient = axios.create({
        baseURL: '/api',
        timeout: 15000,
        headers: getUserHeaders(),
    })

    AxiosClient.interceptors.response.use(value => value, err => Promise.resolve(err))
    return AxiosClient
}

export { useAxios, noAuthClient }
