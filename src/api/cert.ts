import { useAxios } from "@/utils/requests";
import { objectToCamelCase, objectToHungarian } from "@/utils/case";
import { APIResponse, CloudflareErrorResponse } from ".";
import type { AxiosError } from "axios";

export type CertificateAuthority = "digicert" | "google" | "lets_encrypt" | "sectigo" | "ssl_com";

export const CertificateAuthorityDisplay: Record<CertificateAuthority, string> = {
    digicert: "DigiCert",
    google: "Google",
    lets_encrypt: "Let's Encrypt",
    sectigo: "Sectigo",
    ssl_com: "SSL.com",
};

export type CloudflareCertInfo = {
    certificateAuthority: CertificateAuthority;
};

const unknownErrorResponse: CloudflareErrorResponse = {
    success: false,
    errors: [{ code: 0, message: "Unknown error" }],
    messages: [],
};

function getErrorResponse(err: unknown): CloudflareErrorResponse {
    const axiosError = err as AxiosError<CloudflareErrorResponse>;
    return axiosError.response?.data ?? unknownErrorResponse;
}

export async function getCertInfo(zoneId: string): Promise<APIResponse<CloudflareCertInfo>> {
    const axios = useAxios();

    try {
        const response = await axios.request<APIResponse<CloudflareCertInfo>>({
            url: `/zones/${zoneId}/ssl/universal/settings`,
            method: "get",
        });

        return objectToCamelCase(response.data) as APIResponse<CloudflareCertInfo>;
    } catch (err) {
        return objectToCamelCase(getErrorResponse(err)) as APIResponse<CloudflareCertInfo>;
    }
}

export async function patchCertAuthority(
    zoneId: string,
    authority: CertificateAuthority,
): Promise<APIResponse<CloudflareCertInfo>> {
    const axios = useAxios();
    try {
        const response = await axios.request<APIResponse<CloudflareCertInfo>>({
            url: `/zones/${zoneId}/ssl/universal/settings`,
            method: "patch",
            data: objectToHungarian({
                certificateAuthority: authority,
            }),
        });

        return objectToCamelCase(response.data) as APIResponse<CloudflareCertInfo>;
    } catch (err) {
        return objectToCamelCase(getErrorResponse(err)) as APIResponse<CloudflareCertInfo>;
    }
}
