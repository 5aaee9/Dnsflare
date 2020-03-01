import { CloudflarePageInfo } from '@/api'

export type HeyUIPagination = {
    page: number
    size: number
    total: number
}

export type HeyUIPaginationChangeRequest = {
    page: number
    total: number
    cur: number
    size: number
}

export function convertPagination(page: CloudflarePageInfo): HeyUIPagination {
    return {
        page: page.page,
        size: page.perPage,
        total: page.totalCount,
    }
}
