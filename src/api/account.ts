import { noAuthClient } from '@/utils/requests'
import { APIResponse } from '.'

type UserTokenVerifyBody = {
    id: string
    status: string
}

export async function userTokenVerify(token: string): Promise<boolean> {
    try {
        const response = await noAuthClient.request<APIResponse<UserTokenVerifyBody>>({
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

export async function userEmailVerify(email: string, globalToken: string): Promise<boolean> {
    try {
        await noAuthClient.request<APIResponse<UserTokenVerifyBody>>({
            url: '/user',
            headers: {
                'X-Auth-Key': globalToken,
                'X-Auth-Email': email,
            },
            method: 'get',
        })

        return true
    } catch (err) {
        return false
    }
}
