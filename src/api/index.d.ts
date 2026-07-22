import { DnsRecordTypeEnum } from "./enum";

export type ErrorEntity = {
    code: number;
    message: string;
    errorChain?: ErrorEntity[];
};

export type Message = {
    code: number;
    message: string;
    type: "error" | "warning" | "info";
};

export type CloudflareError = ErrorEntity;

export type CloudflarePageInfo = {
    page: number;
    perPage: number;
    totalPages: number;
    count: number;
    totalCount: number;
};

export type APIResponse<T> = {
    result: T | null;
    success: boolean;
    errors: ErrorEntity[];
    messages: Message[];
    resultInfo?: CloudflarePageInfo;
};

export type CloudflareErrorResponse = {
    success: false;
    errors: ErrorEntity[];
    messages: Message[];
};

export type CloudflareHostInfo = {
    // Partner host name
    name: string;

    // Partner host website
    website: string;
};

export type CloudflareLegacyId = "free" | "pro" | "business" | "enterprise";
export type CloudflarePriceFrequency = "weekly" | "monthly" | "quarterly" | "yearly" | "read only";

export type CloudflarePlan = {
    // Plan identifier tag
    id: string;

    // The plan name
    name: string;

    // The price of the subscription that will be billed, in US dollars
    price: number;

    // The monetary unit in which pricing information is displayed
    currency: string;

    // The frequency at which you will be billed for this plan
    frequency: CloudflarePriceFrequency;

    // If the zone is subscribed to this plan
    isSubscribed: boolean;

    // If the zone is allowed to subscribe to this plan
    canSubscribe: boolean;

    // Interseting, Plesk Plus with WAF is pro at legacyId
    // A 'friendly' identifier to indicate to the UI what plan the object is
    legacyId: CloudflareLegacyId;

    // Not show in cloudflare docs definition
    legacyDiscount: boolean;

    // Is plan managed by externally host
    // Can't edit zone settings in cloudflare
    // Not show in cloudflare docs definition
    externallyManaged: boolean;
};

export type CloudflareZoneStatus =
    | "active"
    | "pending"
    | "initializing"
    | "moved"
    | "deleted"
    | "deactivated";

export type CloudflareUserOwner = {
    // User identifier tag
    id: string;
    // Your contact email address
    email: string;
    // The type of owner of the zone
    type: "user";
};

export type CloudflareOrganizationOwner = {
    // Organization identifier tag
    id: string;
    // Organization Name
    name: string;
    // The type of owner of the zone
    type: "organization";
};

export type CloudflareZoneOwner = CloudflareUserOwner | CloudflareOrganizationOwner;

export type CloudflareZoneRecord = {
    // Zone identifier tag
    id: string;

    // The domain name
    name: string;

    // Status of the zone
    status: CloudflareZoneStatus;

    // Indicates if the zone is only using Cloudflare DNS services.
    // A true value means the zone will not receive security or performance benefits.
    paused: boolean;

    // A full zone implies that DNS is hosted with Cloudflare.
    // A partial zone is typically a partner-hosted zone or a CNAME setup.
    type: "partial" | "full";

    // The interval (in seconds) from when development mode expires
    // (positive integer) or last expired (negative integer) for the domain.
    // If development mode has never been enabled, this value is 0.
    developmentMode: number;

    // ISO 8601 When the zone was last modified
    modifiedOn: string;

    // ISO 8601 When the zone was created
    createdOn: string;

    // ISO 8601 The last time proof of ownership was detected and the zone was made active
    activatedOn: string;

    // Cloudflare partner host info
    host?: CloudflareHostInfo;

    // Information about the owner of the zone
    owner: CloudflareZoneOwner;

    // Information about the account the zone belongs to
    account: {
        // Account identifier tag
        id: string;

        // Account name
        name: string;
    };

    // Available permissions on the zone for the current user requesting the
    permissions: string[];
};

export type PageSettings = {
    perPage: number;
    page: number;
};

export type DnsRecordType =
    | "A"
    | "AAAA"
    | "CNAME"
    | "CAA"
    | "TXT"
    | "SRV"
    | "LOC"
    | "MX"
    | "NS"
    | "SPF"
    | "CERT"
    | "DNSKEY"
    | "DS"
    | "NAPTR"
    | "SMIMEA"
    | "SSHFP"
    | "TLSA"
    | "URI"
    | "PTR"
    | "HTTPS"
    | "SVCB"
    | "SOA"
    | DnsRecordTypeEnum;

export type CloudflareDnsRecord = {
    // DNS record identifier tag
    id: string;

    // Record type
    type: DnsRecordType;

    // DNS record name
    name: string;

    // A valid IPv4 address
    content: string;

    // Whether the record can be proxied by Cloudflare or not
    proxiable: boolean;

    // Whether the record is receiving the performance and security benefits of Cloudflare
    proxied: boolean;

    // Time to live for DNS record. Value of 1 is 'automatic'
    ttl: number;

    // Whether this record can be modified/deleted (true means it's managed by Cloudflare)
    locked: boolean;

    // Zone identifier tag
    zoneId: string;

    // The domain of the record
    zoneName: string;

    // When the record was last modified
    modifiedOn: "2018-03-01T14:47:53.403547Z";

    // When the record was created
    createdOn: "2018-03-01T14:47:53.403547Z";

    // Extra Cloudflare-specific information about the record
    meta: {
        // Will exist if Cloudflare automatically added this DNS record during initial setup.
        autoAdded: boolean;
        // Present and true for Cloudflare-managed records (R2 bucket / Worker custom domains)
        readOnly?: boolean;
        // Present when the record is backed by an R2 storage bucket
        r2Bucket?: string;
        // Present when the record is backed by a Worker
        originWorkerId?: string;
        [key: string]: string | boolean | undefined;
    };
    priority?: number;
    data?: CloudflareDnsRecordData;

    // Comments or notes about the DNS record. This field has no effect on DNS responses.
    comment?: string;

    // When the record comment was last modified. Omitted if there is no comment.
    commentModifiedOn?: string;

    // Custom tags for the DNS record. This field has no effect on DNS responses.
    tags?: string[];

    // When the record tags were last modified. Omitted if there are no tags.
    tagsModifiedOn?: string;
};

export type CloudflareDnsRecordData = {
    weight?: number;
    port?: number;
    target?: string;
    priority?: number;
    flags?: number | string;
    tag?: string;
    value?: string;
    // DS record fields
    keyTag?: number;
    algorithm?: number;
    digestType?: number;
    digest?: string;
    // DNSKEY record fields
    protocol?: number;
    publicKey?: string;
    // CERT record fields
    type?: number;
    certificate?: string;
    // SSHFP record fields
    fingerprint?: string;
    // TLSA / SMIMEA record fields
    usage?: number;
    selector?: number;
    matchingType?: number;
    // NAPTR record fields
    order?: number;
    preference?: number;
    service?: string;
    regex?: string;
    replacement?: string;
    // LOC record fields
    latDegrees?: number;
    latMinutes?: number;
    latSeconds?: number;
    latDirection?: string;
    longDegrees?: number;
    longMinutes?: number;
    longSeconds?: number;
    longDirection?: string;
    altitude?: number;
    size?: number;
    precisionHorz?: number;
    precisionVert?: number;
};
