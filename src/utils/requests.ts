import axios from 'axios'
import { useUserStore } from '@/store/user'


axios.interceptors.response.use(value => value, err => Promise.resolve(err))

const noAuthClient = axios.create({
    baseURL: '/api',
    timeout: 15000,
})


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

    return AxiosClient
}

export { useAxios, noAuthClient }
