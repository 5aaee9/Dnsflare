import AxiosClient, { getUserHeaders } from '@/utils/requests'
import { objectToCamelCase, objectToHungarian } from '@/utils/case'
import { APIResponse, CloudflareDnsRecord, PageSettings, DnsRecordType } from '.'


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
    try {
        await AxiosClient.request({
            url: `zones/${payload.zoneId}/dns_records/${payload.id}`,
            method: 'delete',
            headers: getUserHeaders(),
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
    try {
        await AxiosClient.request({
            method: 'post',
            data: request,
            url: `/zones/${zone}/dns_records`,
            headers: getUserHeaders(),
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
    try {
        await AxiosClient.request({
            method: 'patch',
            data: editRequest,
            url: `/zones/${record.zoneId}/dns_records/${record.id}`,
            headers: getUserHeaders(),
        })
    } catch (err) {
        return err.response.data.errors[0].message
    }
}

export async function putRecord(record: CloudflareDnsRecord, editRequest: EditDnsRecordRequest) {
    try {
        await AxiosClient.request({
            method: 'put',
            data: editRequest,
            url: `/zones/${record.zoneId}/dns_records/${record.id}`,
            headers: getUserHeaders(),
        })
    } catch (err) {
        return err.response.data.errors[0].message
    }
}
