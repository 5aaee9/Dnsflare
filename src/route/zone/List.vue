<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>
                Home
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                Zone 列表
            </el-breadcrumb-item>
        </el-breadcrumb>

        <br>
        <el-card>
            <template #header>
                <div>
                    <span>Zone 列表</span>
                </div>
            </template>
            <el-table
                v-loading="isLoading"
                :data="datas"
            >
                <el-table-column
                    prop="name"
                    label="域名"
                />
                <el-table-column
                    prop="status"
                    label="状态"
                />
                <el-table-column
                    label="接入商"
                >
                    <template #default="scope">
                        {{ (scope.row.host || {name: 'Cloudflare'}).name }}
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100"
                >
                    <template #default="scope">
                        <el-button
                            type="text"
                            size="small"
                            @click.prevent="listZoneRecord(scope.row)"
                        >
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br>
            <el-pagination
                :page-size="pageInfo.size"
                :current-page="pageInfo.page"
                layout="prev, pager, next, sizes"
                :total="pageInfo.total"
                style="text-align: center;"
                @current-change="changePage"
                @size-change="changeSize"
            />
        </el-card>
    </div>
</template>


<script lang="ts" setup>
import { Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import { listUserZones } from '../../api/zone'
import { PaginationDetails, convertPagination } from '../../utils/pagination'
import { CloudflareZoneRecord, PageSettings } from '@/api'

const isLoading = ref(true)
const datas: Ref<CloudflareZoneRecord[]> = ref([])
const pageInfo: Ref<PaginationDetails> = ref({
    page: 1,
    size: 10,
    total: 0,
})
const router = useRouter()

async function loadPage(page?: PageSettings) {
    isLoading.value = true
    const zones = await listUserZones(page)

    isLoading.value = false

    if (zones.result) {
        datas.value = zones.result
        if (zones.resultInfo) {
            pageInfo.value = convertPagination(zones.resultInfo)
        }
    }
}

function changePage(pageNumber: number) {
    return loadPage({
        perPage: pageInfo.value.size,
        page: pageNumber,
    })
}

function changeSize(pageSize: number) {
    return loadPage({
        perPage: pageSize,
        page: pageInfo.value.page,
    })
}

function listZoneRecord(data: CloudflareZoneRecord) {
    router.push({
        name: 'ZoneRecordList',
        params: {
            id: data.id,
        },
    })
}

await loadPage({
    perPage: 10,
    page: 0,
})
</script>
