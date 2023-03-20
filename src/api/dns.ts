import { useAxios } from '@/utils/requests'
import { objectToCamelCase, objectToHungarian } from '@/utils/case'
import { LoadPageFunc, LoadPageResponse, convertPagination } from '@/utils/pagination'
import { APIResponse, CloudflareDnsRecord, PageSettings, DnsRecordType } from '.'


export async function listZoneDnsRecord(
    zoneId: string, page?: PageSettings): Promise<APIResponse<CloudflareDnsRecord[]>> {
    let url = `/zones/${zoneId}/dns_records`
    const axios = useAxios()
    if (page) {
        url += `?${new URLSearchParams(objectToHungarian(page)).toString()}`
    }


    const response = await axios.request<CloudflareDnsRecord[]>({
        url,
        method: 'get',
    })

    return (objectToCamelCase(response.data) as any)
}

export function listZoneDnsRecordAll(zoneId: string): LoadPageFunc<CloudflareDnsRecord> {
    return async function (page?: PageSettings): Promise<LoadPageResponse<CloudflareDnsRecord>> {
        const data = await listZoneDnsRecord(zoneId, page)

        return {
            data: data.result!,
            pageDetail: convertPagination(data.resultInfo!)
        }
    }
}

export async function deleteRecord(payload: CloudflareDnsRecord): Promise<string | undefined> {
    const axios = useAxios()
    try {
        await axios.request({
            url: `zones/${payload.zoneId}/dns_records/${payload.id}`,
            method: 'delete',
        })
    }  catch (err) {
        return err.response.data.errors[0].message
    }
}


type CreateDnsRecordRequest = {
    // DNS record type
    type: DnsRecordType,

    // DNS record name
    name: string

    // DNS record content
    content: string

    // Time to live for DNS record. Value of 1 is 'automatic'
    ttl: number

    // Used with some records like MX and SRV to determine priority.
    // If you do not supply a priority for an MX record, a default value of 0 will be set
    priority?: number

    // Whether the record is receiving the performance and security benefits of Cloudflare
    proxied?: boolean
}

export async function createDnsRecord(zone: string, request: CreateDnsRecordRequest): Promise<string | undefined> {
    const axios = useAxios()
    try {
        await axios.request({
            method: 'post',
            data: request,
            url: `/zones/${zone}/dns_records`,
        })
    } catch (err) {
        return err.response.data.errors[0].message
    }
}

type EditDnsRecordRequest = {
    // DNS record type
    type?: DnsRecordType,

    // DNS record name
    name?: string

    // DNS record content
    content?: string

    // Time to live for DNS record. Value of 1 is 'automatic'
    ttl?: number

    // Used with some records like MX and SRV to determine priority.
    // If you do not supply a priority for an MX record, a default value of 0 will be set
    priority?: number

    // Whether the record is receiving the performance and security benefits of Cloudflare
    proxied?: boolean
}


export async function patchRecord(record: CloudflareDnsRecord, editRequest: EditDnsRecordRequest) {
    const axios = useAxios()
    try {
        await axios.request({
            method: 'patch',
            data: editRequest,
            url: `/zones/${record.zoneId}/dns_records/${record.id}`,
        })
    } catch (err) {
        return err.response.data.errors[0].message
    }
}

export async function putRecord(record: CloudflareDnsRecord, editRequest: EditDnsRecordRequest) {
    const axios = useAxios()
    try {
        await axios.request({
            method: 'put',
            data: editRequest,
            url: `/zones/${record.zoneId}/dns_records/${record.id}`,
        })
    } catch (err) {
        return err.response.data.errors[0].message
    }
}
