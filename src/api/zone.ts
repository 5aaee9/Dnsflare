import { useAxios } from '@/utils/requests'
import { objectToCamelCase, objectToHungarian } from '@/utils/case'
import { LoadPageResponse, convertPagination } from '@/utils/pagination'
import { APIResponse, CloudflareZoneRecord, PageSettings } from '.'

export async function listUserZones(page?: PageSettings): Promise<APIResponse<CloudflareZoneRecord[]>> {
    const axios = useAxios()
    let url = '/zones'

    const urlQuery = {
        ...objectToHungarian(page)
    }

    url += `?${new URLSearchParams(urlQuery).toString()}`
    const response = await axios.request<any>({
        url,
        method: 'get',
    })

    return (objectToCamelCase(response.data) as any)
}


export async function listUserZonesAll(page?: PageSettings): Promise<LoadPageResponse<CloudflareZoneRecord>> {
    const zones = await listUserZones(page)

    return {
        data: zones.result!,
        pageDetail: convertPagination(zones.resultInfo!)
    }
}
