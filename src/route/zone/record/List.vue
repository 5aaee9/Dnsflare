<template>
    <div>
        <Modal v-model="modal.create">
            <NewRecordModal
                :zone="zoneId"
                @close="modal.create = false"
                @success="refresh"
            />
        </Modal>
        <br>
        <Breadcrumb :datas="breadcrumbs" />
        <br>
        <div
            class="h-panel"
        >
            <div class="h-panel-bar">
                <span class="h-panel-title">DNS 列表</span>
                <div class="h-panel-right">
                    <button
                        class="h-btn h-btn-green h-btn-m"
                        @click="openCreateModal"
                    >
                        新建
                    </button>
                </div>
            </div>

            <div class="h-panel-body">
                <Loading
                    text="加载 DNS 列表中"
                    :loading="isLoading"
                />

                <Table
                    :datas="datas"
                    stripe
                >
                    <TableItem
                        title="域名"
                        :width="300"
                    >
                        <template slot-scope="{data}">
                            {{ data.name }}
                        </template>
                    </TableItem>
                    <TableItem
                        title="类型"
                        prop="type"
                        sort="auto"
                        :width="100"
                    />
                    <TableItem
                        title="内容"
                        prop="content"
                        sort="auto"
                        :width="300"
                    />
                    <TableItem
                        title="TTL"
                        :width="100"
                    >
                        <template slot-scope="{data}">
                            {{ data.ttl === 1 ? '自动' : data.ttl }}
                        </template>
                    </TableItem>
                    <TableItem
                        title="CDN"
                        :width="100"
                    >
                        <template slot-scope="{data}">
                            <h-switch
                                :value="data.proxied"
                                :disabled="!data.proxiable"
                                @change="changeProxied(data, !data.proxied)"
                            />
                        </template>
                    </TableItem>
                    <TableItem
                        title="操作"
                        :width="100"
                        fixed="right"
                    >
                        <template slot-scope="{data}">
                            <Poptip
                                content="你真的要删除这条记录吗? 他将会永久消失 (真的很久)"
                                placement="right"
                                @confirm="deleteRecord(data)"
                            >
                                <button
                                    class="h-btn h-btn-s h-btn-red"
                                >
                                    <i class="h-icon-trash" />
                                </button>
                            </Poptip>
                        </template>
                    </TableItem>
                </Table>
                <br>
                <Pagination
                    v-model="pageInfo"
                    @change="changePage"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { listZoneDnsRecord, deleteRecord, patchRecord } from '@/api/dns'
import NewRecordModal from './NewRecord.vue'
import { CloudflareDnsRecord, PageSettings } from '@/api'
import { HeyUIPagination, convertPagination, HeyUIPaginationChangeRequest } from '../../../utils/pagination'

@Component({
    components: { NewRecordModal },
})
export default class ZoneRecordListRoute extends Vue {
    private isLoading = true

    private modal = {
        create: false,
    }
    private datas: CloudflareDnsRecord[] = []
    private readonly breadcrumbs = [{
        icon: 'h-icon-home',
    }, {
        title: 'Zone 列表',
        route: { name: 'ZoneList' },
    }, {
        title: 'DNS 列表',
    }]
    private curPage: PageSettings = {
        page: 1,
        perPage: 20,
    }
    private pageInfo: HeyUIPagination = {
        page: 1,
        size: 20,
        total: 0,
    }

    mounted() {
        this.loadPage()
    }

    get zoneId(): string {
        const {id} = this.$route.params

        return id
    }

    async loadPage(page?: PageSettings) {
        this.isLoading = true

        const records = await listZoneDnsRecord(this.zoneId, page)

        if (records.result) {
            this.datas = records.result
            if (records.resultInfo) {
                this.pageInfo = convertPagination(records.resultInfo)
            }
        }

        this.isLoading = false
    }

    async changeProxied(record: CloudflareDnsRecord, proxied: boolean) {
        this.isLoading = true
        const res = await patchRecord(record, {
            proxied,
        })

        this.isLoading = false

        if (!res) {
            this.$Message('修改成功, 正在刷新')
            this.refresh()
        } else {
            this.$Message({
                type: 'error',
                text: `修改失败, 错误: ${res}`,
            })
        }
    }

    refresh() {
        this.loadPage(this.curPage)
    }

    changePage(v: HeyUIPaginationChangeRequest) {
        const doc: PageSettings = {
            perPage: v.size,
            page: v.page,
        }

        this.curPage = doc
        this.loadPage(doc)
    }

    async deleteRecord(record: CloudflareDnsRecord) {
        const deleteError = await deleteRecord(record)

        if (deleteError) {
            this.$Message({
                type: 'error',
                text: `删除失败, 原因: ${deleteError}`,
            })
        } else {
            this.$Message('删除成功, 刷新中')
        }

        this.refresh()
    }

    openCreateModal() {
        this.modal.create = true
    }
}
</script>
