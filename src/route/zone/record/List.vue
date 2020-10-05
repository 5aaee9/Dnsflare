<template>
    <div>
        <RecordModal
            ref="record"
            :zone="zoneId"
            @success="refresh"
        />
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>
                Home
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'ZoneList' }">
                Zone 列表
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                DNS 列表
            </el-breadcrumb-item>
        </el-breadcrumb>
        <br>
        <el-card>
            <div
                slot="header"
                style="display: flex"
            >
                <span>DNS 列表</span>
                <el-button
                    id="create-record-button"
                    type="text"
                    @click="displayCreate"
                >
                    创建
                </el-button>
            </div>
            <el-table
                v-loading="isLoading"
                :data="datas"
            >
                <el-table-column
                    prop="name"
                    label="域名"
                />
                <el-table-column
                    prop="type"
                    label="类型"
                />
                <el-table-column
                    prop="content"
                    label="内容"
                />
                <el-table-column
                    label="TTL"
                >
                    <template slot-scope="data">
                        {{ data.row.ttl === 1 ? '自动' : data.row.ttl }}
                    </template>
                </el-table-column>

                <el-table-column
                    label="CDN"
                >
                    <template slot-scope="data">
                        <el-switch
                            :value="data.row.proxied"
                            :disabled="!data.row.proxiable"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="changeProxied(data.row, !data.row.proxied)"
                        />
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="100"
                >
                    <template slot-scope="scope">
                        <el-popconfirm
                            confirm-button-text="好的"
                            cancel-button-text="算了吧"
                            icon="el-icon-info"
                            icon-color="red"
                            title="你真的要删除这条记录吗? 它将会永久消失 (真的很久)"
                            @onConfirm="deleteRecord(scope.row)"
                        >
                            <el-button
                                slot="reference"
                                type="text"
                                size="small"
                            >
                                删除
                            </el-button>
                        </el-popconfirm>
                        <el-button
                            slot="reference"
                            type="text"
                            size="small"
                            @click.native.prevent="editRecord(scope.row)"
                        >
                            修改
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br>
            <el-pagination
                :page-size="pageInfo.size"
                :current-page.sync="pageInfo.page"
                layout="prev, pager, next, sizes"
                :total="pageInfo.total"
                style="text-align: center;"
                @current-change="changePage"
                @size-change="changeSize"
            />
        </el-card>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { listZoneDnsRecord, deleteRecord, patchRecord } from '@/api/dns'
import RecordModal from './Record.vue'
import { CloudflareDnsRecord, PageSettings } from '@/api'
import { PaginationDetails, convertPagination } from '@/utils/pagination'

@Component({
    components: { RecordModal },
})
export default class ZoneRecordListRoute extends Vue {
    private isLoading = true

    private datas: CloudflareDnsRecord[] = []
    private pageInfo: PaginationDetails = {
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
            this.$message('修改成功, 正在刷新')
            this.refresh()
        } else {
            this.$message({
                type: 'error',
                message: `修改失败, 错误: ${res}`,
            })
        }
    }

    refresh() {
        this.loadPage({
            perPage: this.pageInfo.size,
            page: this.pageInfo.page,
        })
    }

    changePage(pageNumber: number) {
        this.loadPage({
            perPage: this.pageInfo.size,
            page: pageNumber,
        })
    }

    changeSize(pageSize: number) {
        this.loadPage({
            perPage: pageSize,
            page: this.pageInfo.page,
        })
    }

    async deleteRecord(record: CloudflareDnsRecord) {
        const deleteError = await deleteRecord(record)

        if (deleteError) {
            this.$message({
                type: 'error',
                message: `删除失败, 原因: ${deleteError}`,
            })
        } else {
            this.$message('删除成功, 刷新中')
        }

        this.refresh()
    }

    get record(): RecordModal {
        return (this.$refs.record as RecordModal)
    }

    displayCreate() {
        this.record.reset()
        this.record.display()
    }


    editRecord(record: CloudflareDnsRecord) {
        this.record.reset()
        this.record.display()

        this.record.setModel({
            name: record.name,
            content: record.content,
            type: record.type,
            ttl: record.ttl,
            proxied: record.proxied,
            autoTTL: record.ttl === 1,
        })

        this.record.setRecord(record)
    }
}
</script>

<style lang="scss" scoped>
    #create-record-button {
        padding: 0;
        margin-left: auto;
    }
</style>
