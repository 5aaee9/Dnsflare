
export type HeyUIPagination = {
    cur: number
    total: number
    size: number

    pagination: {
        page: number
        size: number
        total: number
    }
}

export type HeyUIPaginationChangeRequest = {
    page: number
    total: number
    cur: number
    size: number
}

export function convertPagination(page: CloudflarePageInfo): HeyUIPagination {
    return {
        cur: page.page,
        total: page.totalCount,
        size: page.perPage,

        pagination: {
            page: page.page,
            size: page.perPage,
            total: page.totalCount,
        },
    }
}
