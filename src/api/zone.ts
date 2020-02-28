import AxiosClient, { getUserHeaders } from '@/utils/requests'
import { objectToCamelCase } from '@/utils/case'


export async function listUserZones(): Promise<APIResponse<CloudflareZoneRecord[]>> {
    const response = await AxiosClient.request<any>({
        url: '/zones',
        method: 'get',
        headers: getUserHeaders(),
    })

    return (objectToCamelCase(response.data) as any)
}
