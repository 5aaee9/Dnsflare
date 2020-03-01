<template>
    <div>
        <Modal v-model="modal.create">
            <NewRecordModal @close="modal.create = false" />
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
                    >
                        <template slot-scope="{data}">
                            {{ data.name }}
                        </template>
                    </TableItem>
                    <TableItem
                        title="类型"
                        prop="type"
                        sort="auto"
                    />
                    <TableItem
                        title="内容"
                        prop="content"
                        sort="auto"
                    />
                    <TableItem
                        title="TTL"
                    >
                        <template slot-scope="{data}">
                            {{ data.ttl === 1 ? '自动' : data.ttl }}
                        </template>
                    </TableItem>
                    <TableItem
                        title="CDN"
                    >
                        <template slot-scope="{data}">
                            <h-switch
                                :value="data.proxied"
                                :disabled="!data.proxiable"
                                @change="changeProxied(data)"
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
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { listZoneDnsRecord, deleteRecord } from '@/api/dns'
import NewRecordModal from './NewRecord.vue'
import { CloudflareDnsRecord, PageSettings } from '@/api'

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
            console.log(JSON.parse(JSON.stringify(this.datas)))
        }

        this.isLoading = false
    }

    changeProxied() {

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

        // this.loadPage()
    }

    openCreateModal() {
        this.modal.create = true
    }
}
</script>
