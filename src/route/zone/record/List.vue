<template>
    <RecordModal
        ref="record"
        :zone="zoneId"
        @success="refresh"
    />
    <el-card>
        <template #header>
            <div class="card-header">
                <span style="margin-top: auto; margin-bottom: auto;">DNS 列表</span>
                <el-input @input="updateFilter" v-model="filterList" placeholder="输入过滤" />
                <el-button
                    id="create-record-button"
                    text
                    type="primary"
                    @click="displayCreate"
                >
                    创建
                </el-button>
            </div>
        </template>
        <el-table
            v-loading="isLoading"
            :data="filterTableData"
        >
            <el-table-column
                prop="name"
                label="域名"
            />
            <el-table-column
                prop="type"
                label="类型"
                width="100"
            />
            <el-table-column
                prop="content"
                label="内容"
            />
            <el-table-column
                label="TTL"
                width="100"
            >
                <template #default="scope">
                    {{ scope.row.ttl === 1 ? '自动' : scope.row.ttl }}
                </template>
            </el-table-column>

            <el-table-column
                label="CDN"
                width="100"
            >
                <template #default="scope">
                    <el-switch
                        :modelValue="scope.row.proxied"
                        :disabled="!scope.row.proxiable"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @update:modelValue="changeProxied(scope.row, !scope.row.proxied)"
                    />
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="150"
            >
                <template #default="scope">
                    <el-popconfirm
                        confirm-button-text="好的"
                        cancel-button-text="算了吧"
                        icon="el-icon-info"
                        icon-color="red"
                        title="你真的要删除这条记录吗? 它将会永久消失 (真的很久)"
                        @confirm="doDeleteRecord(scope.row)"
                    >
                        <template #reference>
                            <el-button
                                text
                                type="primary"
                                size="small"
                            >
                                删除
                            </el-button>
                        </template>
                    </el-popconfirm>

                    <el-button
                        text
                        type="primary"
                        size="small"
                        @click.prevent="editRecord(scope.row)"
                    >
                        修改
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
</template>

<script lang="ts" setup>
import { ref, Ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
// import { Vue, Component } from 'vue-property-decorator'
import { listZoneDnsRecord, deleteRecord, patchRecord, listZoneDnsRecordAll } from '@/api/dns'
import RecordModal from './Record.vue'
import { CloudflareDnsRecord, PageSettings } from '@/api'
import { PaginationDetails, convertPagination, LoadPageResponse, fullLoadPages } from '@/utils/pagination'
const filterList = ref("")
const isLoading = ref(true)

const props = defineProps<{
    zoneId: string
}>()

const record = ref<typeof RecordModal>()
const datas: Ref<CloudflareDnsRecord[]> = ref<CloudflareDnsRecord[]>([])
const pageInfo = ref<PaginationDetails>({
    page: 1,
    size: 20,
    total: 0,
})

const zoneId = computed(() => {
    return props.zoneId
})
const filterTableData = computed(() => {
    if (filterList.value.length === 0) {
        return datas.value
    }

    return datas.value.filter(it => {
        return it.name.includes(filterList.value) || it.content.includes(filterList.value)
    })
})

const isFullyLoaded = ref(false)
async function updateFilter() {
    if (!isFullyLoaded.value) {
        if (isLoading.value) {
            return
        }

        isLoading.value = true
        const pages = await fullLoadPages(listZoneDnsRecordAll(props.zoneId))
        pageInfo.value = pages.pageDetail
        datas.value = pages.data

        isFullyLoaded.value = true
        isLoading.value = false
    }
}

async function rawLoadPage(page?: PageSettings): Promise<LoadPageResponse<any>> {
    const records = await listZoneDnsRecord(zoneId.value, page)

    if (records.result && records.resultInfo) {
        return {
            pageDetail: convertPagination(records.resultInfo),
            data: records.result
        }
    }

    return {
        pageDetail: { page: 0, size: 0, total: 0 },
        data: []
    }
}

async function loadPage(page?: PageSettings) {
    isLoading.value = true
    const data = await rawLoadPage(page)

    datas.value = data.data
    pageInfo.value = data.pageDetail

    isLoading.value = false
}

function refresh() {
    return loadPage({
        perPage: pageInfo.value.size,
        page: pageInfo.value.page,
    })
}

async function changeProxied(record: CloudflareDnsRecord, proxied: boolean) {
    isLoading.value = true
    const res = await patchRecord(record, {
        proxied,
    })

    isLoading.value = false

    if (!res) {
        ElMessage('修改成功, 正在刷新')
        await refresh()
    } else {
        ElMessage({
            type: 'error',
            message: `修改失败, 错误: ${res}`,
        })
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

async function doDeleteRecord(record: CloudflareDnsRecord) {
    const deleteError = await deleteRecord(record)

    if (deleteError) {
        ElMessage({
            type: 'error',
            message: `删除失败, 原因: ${deleteError}`,
        })
    } else {
        ElMessage('删除成功, 刷新中')
    }

    await refresh()
}

const getRecord = computed(() => {
    console.log(record.value)
    return record.value as (typeof RecordModal)
})

function displayCreate() {
    getRecord.value.reset()
    getRecord.value.display()
}


function editRecord(record: CloudflareDnsRecord) {
    getRecord.value.reset()
    getRecord.value.display()

    getRecord.value.setModel({
        name: record.name,
        content: record.content,
        type: record.type,
        ttl: record.ttl,
        proxied: record.proxied,
        autoTTL: record.ttl === 1,
    })

    getRecord.value.setRecord(record)
}


loadPage()
</script>

<style lang="scss" scoped>
    #create-record-button {
        padding: 0;
        margin-left: auto;
    }

    .card-header {
        display: grid;
        grid-template-columns: 1fr auto auto;
        grid-column-gap: 1em;
    }

    .card-header > span {
        margin: auto 0;
    }
</style>
