import AxiosClient from '@/utils/requests'

type UserTokenVerifyBody = {
    id: string
    status: string
}

export async function userTokenVerify(token: string): Promise<boolean> {
    try {
        const response = await AxiosClient.request<APIResponse<UserTokenVerifyBody>>({
            url: '/user/tokens/verify',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: 'get',
        })

        return response.data.success
    } catch (err) {
        return false
    }
}
