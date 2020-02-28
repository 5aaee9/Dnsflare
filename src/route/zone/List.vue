<template>
    <div
        class="h-panel"
        style="margin-top: 20px"
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
                />
                <TableItem
                    title="状态"
                    prop="status"
                    sort="auto"
                />
                <TableItem
                    title="接入商"
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
                            @click="remove(datas, data)"
                        >
                            <i class="h-icon-edit" />
                        </button>
                    </template>
                </TableItem>
            </Table>
        </div>
    </div>
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { listUserZones } from '../../api/zone'

@Component({})
export default class ZoneListRoute extends Vue {
    private isLoading = true

    private datas: CloudflareZoneRecord[] = []

    async mounted() {
        const zones = await listUserZones()

        this.isLoading = false

        if (zones.result) {
            this.datas = zones.result
        }

        console.log(this.datas)
    }
}
</script>
