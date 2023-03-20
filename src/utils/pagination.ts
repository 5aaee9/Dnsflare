import { CloudflarePageInfo, PageSettings } from '@/api'

export type PaginationDetails = {
    page: number
    size: number
    total: number
}


export type LoadPageResponse<T> = {
    pageDetail: PaginationDetails
    data: T[]
}

export type LoadPageFunc<T> = (page?: PageSettings) => Promise<LoadPageResponse<T>>


export function convertPagination(page: CloudflarePageInfo): PaginationDetails {
    return {
        page: page.page,
        size: page.perPage,
        total: page.totalCount,
    }
}

const fullLoagePrePage = 50

export async function fullLoadPages<T>(fn: LoadPageFunc<T>): Promise<LoadPageResponse<T>> {
    const initialPageDetail = await fn({
        perPage: fullLoagePrePage,
        page: 1
    })

    const totalCount = Math.ceil(initialPageDetail.pageDetail.total / fullLoagePrePage)
    let fnData: LoadPageResponse<T>[]
    
    if (totalCount > 1) {
        const data = [ ...Array(totalCount + 1).keys() ]
        // Remove first data
        data.shift()

        fnData = await Promise.all(data.map<Promise<LoadPageResponse<T>>>((index: number): Promise<LoadPageResponse<T>> => {
            return fn({
                perPage: fullLoagePrePage, 
                page: index,
            })
        }))
    } else {
        fnData = []
    }

    fnData = [ initialPageDetail, ...fnData ]

    const result: LoadPageResponse<T> = { pageDetail: initialPageDetail.pageDetail, data: [] }
    fnData.forEach(it => result.data = [ ...result.data, ...it.data ])

    return result
}