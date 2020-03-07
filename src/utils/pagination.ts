import { CloudflarePageInfo } from '@/api'

export type PaginationDetails = {
    page: number
    size: number
    total: number
}

export function convertPagination(page: CloudflarePageInfo): PaginationDetails {
    return {
        page: page.page,
        size: page.perPage,
        total: page.totalCount,
    }
}
