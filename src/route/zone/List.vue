<template>
    <div>
        <br>
        <Breadcrumb :datas="breadcrumbs" />
        <br>
        <div
            class="h-panel"
        >
            <div class="h-panel-bar">
                <span class="h-panel-title">Zone 列表</span>
            </div>

            <div class="h-panel-body">
                <Loading
                    text="加载 Zone 列表中"
                    :loading="isLoading"
                />
                <!-- TODO: list display -->

                <Table
                    :datas="datas"
                    stripe
                >
                    <TableItem
                        title="域名"
                        prop="name"
                        sort="auto"
                        :width="300"
                    />
                    <TableItem
                        title="状态"
                        prop="status"
                        sort="auto"
                        :width="100"
                    />
                    <TableItem
                        title="接入商"
                        :width="300"
                    >
                        <template slot-scope="{data}">
                            {{ (data.host || {name: 'Cloudflare'}).name }}
                        </template>
                    </TableItem>
                    <TableItem
                        title="操作"
                        :width="100"
                        fixed="right"
                    >
                        <template slot-scope="{data}">
                            <button
                                class="h-btn h-btn-s h-btn-blue"
                                @click="listZoneRecord(data)"
                            >
                                <i class="h-icon-edit" />
                            </button>
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
import { listUserZones } from '../../api/zone'
import { HeyUIPagination, convertPagination, HeyUIPaginationChangeRequest } from '../../utils/pagination'
import { CloudflareZoneRecord, PageSettings } from '@/api'

@Component({})
export default class ZoneListRoute extends Vue {
    private isLoading = true

    private readonly breadcrumbs = [{
        icon: 'h-icon-home',
    }, {
        title: 'Zone 列表',
        route: { name: 'ZoneList' },
    }]
    private datas: CloudflareZoneRecord[] = []
    private pageInfo: HeyUIPagination = {
        page: 1,
        size: 20,
        total: 0,
    };

    async mounted() {
        this.loadPage()
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

    changePage(v: HeyUIPaginationChangeRequest) {
        this.loadPage({
            perPage: v.size,
            page: v.page,
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
