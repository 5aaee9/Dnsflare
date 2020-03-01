import AxiosClient, { getUserHeaders } from '@/utils/requests'
import { objectToCamelCase, objectToHungarian } from '@/utils/case'
import { APIResponse, CloudflareDnsRecord, PageSettings } from '.'


export async function listZoneDnsRecord(
    zoneId: string, page?: PageSettings): Promise<APIResponse<CloudflareDnsRecord[]>> {
    let url = `/zones/${zoneId}/dns_records`

    if (page) {
        url += `?${new URLSearchParams(objectToHungarian(page)).toString()}`
    }


    const response = await AxiosClient.request<CloudflareDnsRecord[]>({
        url,
        method: 'get',
        headers: getUserHeaders(),
    })

    return (objectToCamelCase(response.data) as any)
}

export async function deleteRecord(payload: CloudflareDnsRecord): Promise<string | undefined> {
    const response = await AxiosClient.request({
        url: `zones/${payload.zoneId}/dns_records/${payload.id}`,
        method: 'delete',
        headers: getUserHeaders(),
    })

    if (!response.data.success) {
        return response.data.errors[0].message
    }
}
