import AxiosClient, { getUserHeaders } from '@/utils/requests'
import { objectToCamelCase, objectToHungarian } from '@/utils/case'

export async function listUserZones(page?: PageSettings): Promise<APIResponse<CloudflareZoneRecord[]>> {
    let url = '/zones'

    if (page) {
        url += `?${new URLSearchParams(objectToHungarian(page)).toString()}`
    }

    const response = await AxiosClient.request<any>({
        url,
        method: 'get',
        headers: getUserHeaders(),
    })

    return (objectToCamelCase(response.data) as any)
}
