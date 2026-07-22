import { useAxios } from "@/utils/requests";
import { objectToCamelCase, objectToHungarian } from "@/utils/case";
import { LoadPageFunc, LoadPageResponse, convertPagination } from "@/utils/pagination";
import {
    APIResponse,
    CloudflareDnsRecordData,
    CloudflareErrorResponse,
    CloudflareDnsRecord,
    PageSettings,
    DnsRecordType,
} from ".";
import type { AxiosError } from "axios";

const unknownErrorResponse: CloudflareErrorResponse = {
    success: false,
    errors: [{ code: 0, message: "Unknown error" }],
    messages: [],
};

function getErrorResponse(err: unknown): CloudflareErrorResponse {
    const axiosError = err as AxiosError<CloudflareErrorResponse>;
    return axiosError.response?.data ?? unknownErrorResponse;
}

export async function listZoneDnsRecord(
    zoneId: string,
    page?: PageSettings,
): Promise<APIResponse<CloudflareDnsRecord[]>> {
    let url = `/zones/${zoneId}/dns_records`;
    const axios = useAxios();
    if (page) {
        const params = objectToHungarian(page) as Record<string, string | number>;
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            searchParams.set(key, String(value));
        });
        url += `?${searchParams.toString()}`;
    }

    const response = await axios.request<APIResponse<CloudflareDnsRecord[]>>({
        url,
        method: "get",
    });

    const data = objectToCamelCase(response.data) as APIResponse<CloudflareDnsRecord[]>;

    data.result?.forEach((record) => {
        record.zoneId = zoneId;
    });

    return data;
}

export function listZoneDnsRecordAll(zoneId: string): LoadPageFunc<CloudflareDnsRecord> {
    return async function (page?: PageSettings): Promise<LoadPageResponse<CloudflareDnsRecord>> {
        const data = await listZoneDnsRecord(zoneId, page);

        return {
            data: data.result!,
            pageDetail: convertPagination(data.resultInfo!),
        };
    };
}

export async function deleteRecord(payload: CloudflareDnsRecord): Promise<string | undefined> {
    const axios = useAxios();
    try {
        await axios.request({
            url: `zones/${payload.zoneId}/dns_records/${payload.id}`,
            method: "delete",
        });
    } catch (err) {
        return getErrorResponse(err).errors[0]?.message;
    }
}

type CreateDnsRecordRequest = {
    // DNS record type
    type: DnsRecordType;

    // DNS record name
    name: string;

    // DNS record content
    content?: string;

    // Time to live for DNS record. Value of 1 is 'automatic'
    ttl: number;

    // Used with some records like MX and SRV to determine priority.
    // If you do not supply a priority for an MX record, a default value of 0 will be set
    priority?: number;

    data?: CloudflareDnsRecordData;

    // Whether the record is receiving the performance and security benefits of Cloudflare
    proxied?: boolean;

    // Comments or notes about the DNS record. This field has no effect on DNS responses.
    comment?: string;

    // Custom tags for the DNS record. This field has no effect on DNS responses.
    tags?: string[];
};

export async function createDnsRecord(
    zone: string,
    request: CreateDnsRecordRequest,
): Promise<string | undefined> {
    const axios = useAxios();
    try {
        await axios.request({
            method: "post",
            data: objectToHungarian(request),
            url: `/zones/${zone}/dns_records`,
        });
    } catch (err) {
        return getErrorResponse(err).errors[0]?.message;
    }
}

type EditDnsRecordRequest = {
    // DNS record type
    type?: DnsRecordType;

    // DNS record name
    name?: string;

    // DNS record content
    content?: string;

    // Time to live for DNS record. Value of 1 is 'automatic'
    ttl?: number;

    // Used with some records like MX and SRV to determine priority.
    // If you do not supply a priority for an MX record, a default value of 0 will be set
    priority?: number;

    data?: CloudflareDnsRecordData;

    // Whether the record is receiving the performance and security benefits of Cloudflare
    proxied?: boolean;

    // Comments or notes about the DNS record. This field has no effect on DNS responses.
    comment?: string;

    // Custom tags for the DNS record. This field has no effect on DNS responses.
    tags?: string[];
};

export async function patchRecord(
    zoneId: string,
    recordId: string,
    editRequest: EditDnsRecordRequest,
) {
    const axios = useAxios();
    try {
        await axios.request({
            method: "patch",
            data: objectToHungarian(editRequest),
            url: `/zones/${zoneId}/dns_records/${recordId}`,
        });
    } catch (err) {
        return getErrorResponse(err).errors[0]?.message;
    }
}

export async function putRecord(
    zoneId: string,
    recordId: string,
    editRequest: EditDnsRecordRequest,
) {
    const axios = useAxios();
    try {
        await axios.request({
            method: "put",
            data: objectToHungarian(editRequest),
            url: `/zones/${zoneId}/dns_records/${recordId}`,
        });
    } catch (err) {
        return getErrorResponse(err).errors[0]?.message;
    }
}
