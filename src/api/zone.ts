import { useAxios } from '@/utils/requests'
import { objectToCamelCase, objectToHungarian } from '@/utils/case'
import { APIResponse, CloudflareZoneRecord, PageSettings } from '.'

export async function listUserZones(page?: PageSettings): Promise<APIResponse<CloudflareZoneRecord[]>> {
    const axios = useAxios()
    let url = '/zones'

    if (page) {
        url += `?${new URLSearchParams(objectToHungarian(page)).toString()}`
    }

    const response = await axios.request<any>({
        url,
        method: 'get',
    })

    return (objectToCamelCase(response.data) as any)
}
