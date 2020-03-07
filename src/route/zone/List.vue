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
            <div slot="header">
                <span>Zone 列表</span>
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
                    prop="status"
                    label="状态"
                />
                <el-table-column
                    label="接入商"
                >
                    <template slot-scope="data">
                        {{ (data.host || {name: 'Cloudflare'}).name }}
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="50"
                >
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            size="small"
                            @click.native.prevent="listZoneRecord(scope.row)"
                        >
                            编辑
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
import { listUserZones } from '../../api/zone'
import { PaginationDetails, convertPagination } from '../../utils/pagination'
import { CloudflareZoneRecord, PageSettings } from '@/api'

@Component({})
export default class ZoneListRoute extends Vue {
    private isLoading = true

    private datas: CloudflareZoneRecord[] = []
    private pageInfo: PaginationDetails = {
        page: 1,
        size: 10,
        total: 0,
    };

    async mounted() {
        await this.loadPage({
            perPage: 10,
            page: 0,
        })
    }

    async loadPage(page?: PageSettings) {
        this.isLoading = true
        const zones = await listUserZones(page)

        this.isLoading = false

        if (zones.result) {
            this.datas = zones.result
            if (zones.resultInfo) {
                this.pageInfo = convertPagination(zones.resultInfo)
            }
        }
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

    listZoneRecord(data: CloudflareZoneRecord) {
        this.$router.push({
            name: 'ZoneRecordList',
            params: {
                id: data.id,
            },
        })
    }
}
</script>
