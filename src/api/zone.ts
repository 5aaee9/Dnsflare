import { useAxios } from "@/utils/requests";
import { objectToCamelCase, objectToHungarian } from "@/utils/case";
import { LoadPageResponse, convertPagination } from "@/utils/pagination";
import { APIResponse, CloudflareErrorResponse, CloudflareZoneRecord, PageSettings } from ".";
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

export async function listUserZones(
    page?: PageSettings,
): Promise<APIResponse<CloudflareZoneRecord[]>> {
    const axios = useAxios();
    let url = "/zones";

    const urlQuery = objectToHungarian(page ?? {}) as Record<string, string | number>;
    const searchParams = new URLSearchParams();
    Object.entries(urlQuery).forEach(([key, value]) => {
        searchParams.set(key, String(value));
    });

    url += `?${searchParams.toString()}`;
    try {
        const response = await axios.request<APIResponse<CloudflareZoneRecord[]>>({
            url,
            method: "get",
        });

        return objectToCamelCase(response.data) as APIResponse<CloudflareZoneRecord[]>;
    } catch (err) {
        return objectToCamelCase(getErrorResponse(err)) as APIResponse<CloudflareZoneRecord[]>;
    }
}

export async function listUserZonesAll(
    page?: PageSettings,
): Promise<LoadPageResponse<CloudflareZoneRecord>> {
    const zones = await listUserZones(page);

    return {
        data: zones.result!,
        pageDetail: convertPagination(zones.resultInfo!),
    };
}
