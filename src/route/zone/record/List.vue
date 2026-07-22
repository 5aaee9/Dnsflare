<template>
    <RecordModal ref="record" :zone="zoneId" @success="refresh" />
    <el-card>
        <template #header>
            <div class="card-header">
                <span style="margin-top: auto; margin-bottom: auto">DNS 列表</span>
                <el-input v-model="filterList" placeholder="输入过滤" @input="updateFilter" />
                <div class="batch-ops">
                    <span v-if="selectedRecords.length > 0" class="selection-count">
                        已选 {{ selectedRecords.length }} 条
                    </span>
                    <el-button
                        size="small"
                        :disabled="selectedRecords.length === 0"
                        @click="batchEnableCDN"
                    >
                        批量启用 CDN
                    </el-button>
                    <el-button
                        size="small"
                        :disabled="selectedRecords.length === 0"
                        @click="batchDisableCDN"
                    >
                        批量禁用 CDN
                    </el-button>
                    <el-popconfirm
                        confirm-button-text="好的"
                        cancel-button-text="算了吧"
                        icon="el-icon-info"
                        icon-color="red"
                        title="确定要删除选中的记录吗? 它们将会永久消失 (真的很久)"
                        @confirm="batchDelete"
                    >
                        <template #reference>
                            <el-button
                                size="small"
                                type="danger"
                                :disabled="selectedRecords.length === 0"
                            >
                                批量删除
                            </el-button>
                        </template>
                    </el-popconfirm>
                </div>
                <el-button id="create-record-button" text type="primary" @click="displayCreate">
                    创建
                </el-button>
            </div>
        </template>
        <el-table
            v-loading="isLoading"
            :data="filterTableData"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" :selectable="isSelectable" width="55" />
            <el-table-column prop="name" label="域名" />
            <el-table-column label="类型" width="140">
                <template #default="scope">
                    <span>{{ displayType(scope.row) }}</span>
                    <el-tag
                        v-if="isReadOnly(scope.row)"
                        size="small"
                        type="info"
                        style="margin-left: 6px"
                    >
                        只读
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="content" label="内容" />
            <el-table-column prop="comment" label="备注" width="150" show-overflow-tooltip />
            <el-table-column label="TTL" width="100">
                <template #default="scope">
                    {{ scope.row.ttl === 1 ? "自动" : scope.row.ttl }}
                </template>
            </el-table-column>

            <el-table-column label="CDN" width="100">
                <template #default="scope">
                    <el-switch
                        :model-value="scope.row.proxied"
                        :disabled="isReadOnly(scope.row) || !scope.row.proxiable"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @update:model-value="changeProxied(scope.row, !scope.row.proxied)"
                    />
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template #default="scope">
                    <template v-if="!isReadOnly(scope.row)">
                        <el-popconfirm
                            confirm-button-text="好的"
                            cancel-button-text="算了吧"
                            icon="el-icon-info"
                            icon-color="red"
                            title="你真的要删除这条记录吗? 它将会永久消失 (真的很久)"
                            @confirm="doDeleteRecord(scope.row)"
                        >
                            <template #reference>
                                <el-button text type="primary" size="small"> 删除 </el-button>
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
                    <span v-else style="color: #999; font-size: 12px"> 只读 </span>
                </template>
            </el-table-column>
        </el-table>
        <br />
        <el-pagination
            :page-size="pageInfo.size"
            :current-page="pageInfo.page"
            layout="prev, pager, next, sizes"
            :total="pageInfo.total"
            style="text-align: center"
            @current-change="changePage"
            @size-change="changeSize"
        />
    </el-card>
</template>

<script lang="ts" setup>
import { ref, Ref, computed } from "vue";
import { ElMessage } from "element-plus";
// import { Vue, Component } from 'vue-property-decorator'
import { listZoneDnsRecord, deleteRecord, patchRecord, listZoneDnsRecordAll } from "@/api/dns";
import RecordModal from "./Record.vue";
import { CloudflareDnsRecord, PageSettings } from "@/api";
import {
    PaginationDetails,
    convertPagination,
    LoadPageResponse,
    fullLoadPages,
} from "@/utils/pagination";

defineOptions({ name: "ZoneRecordListPage" });
const filterList = ref("");
const isLoading = ref(true);

const props = defineProps<{
    zoneId: string;
}>();

const record = ref<typeof RecordModal>();
const datas: Ref<CloudflareDnsRecord[]> = ref<CloudflareDnsRecord[]>([]);
const selectedRecords = ref<CloudflareDnsRecord[]>([]);
const pageInfo = ref<PaginationDetails>({
    page: 1,
    size: 20,
    total: 0,
});

const zoneId = computed(() => {
    return props.zoneId;
});
const filterTableData = computed(() => {
    let data = datas.value;
    if (filterList.value.length > 0) {
        data = data.filter((it) => {
            return it.name.includes(filterList.value) || it.content.includes(filterList.value);
        });
    }
    // Sort read-only records (SOA, R2, Worker) to the bottom
    return [...data].sort((a, b) => {
        const aReadOnly = isReadOnly(a) ? 1 : 0;
        const bReadOnly = isReadOnly(b) ? 1 : 0;
        return aReadOnly - bReadOnly;
    });
});

const isFullyLoaded = ref(false);
async function updateFilter() {
    if (!isFullyLoaded.value) {
        if (isLoading.value) {
            return;
        }

        isLoading.value = true;
        const pages = await fullLoadPages(listZoneDnsRecordAll(props.zoneId));
        pageInfo.value = pages.pageDetail;
        datas.value = pages.data;

        isFullyLoaded.value = true;
        isLoading.value = false;
    }
}

async function rawLoadPage(page?: PageSettings): Promise<LoadPageResponse<CloudflareDnsRecord>> {
    const records = await listZoneDnsRecord(zoneId.value, page);

    if (records.result && records.resultInfo) {
        return {
            pageDetail: convertPagination(records.resultInfo),
            data: records.result,
        };
    }

    return {
        pageDetail: { page: 0, size: 0, total: 0 },
        data: [],
    };
}

async function loadPage(page?: PageSettings) {
    isLoading.value = true;
    const data = await rawLoadPage(page);

    datas.value = data.data;
    pageInfo.value = data.pageDetail;

    isLoading.value = false;
}

function refresh() {
    return loadPage({
        perPage: pageInfo.value.size,
        page: pageInfo.value.page,
    });
}

async function changeProxied(record: CloudflareDnsRecord, proxied: boolean) {
    isLoading.value = true;
    const res = await patchRecord(zoneId.value, record.id, {
        proxied,
    });

    isLoading.value = false;

    if (!res) {
        ElMessage("修改成功, 正在刷新");
        await refresh();
    } else {
        ElMessage({
            type: "error",
            message: `修改失败, 错误: ${res}`,
        });
    }
}

function changePage(pageNumber: number) {
    return loadPage({
        perPage: pageInfo.value.size,
        page: pageNumber,
    });
}

function changeSize(pageSize: number) {
    return loadPage({
        perPage: pageSize,
        page: pageInfo.value.page,
    });
}

async function doDeleteRecord(record: CloudflareDnsRecord) {
    const deleteError = await deleteRecord(record);

    if (deleteError) {
        ElMessage({
            type: "error",
            message: `删除失败, 原因: ${deleteError}`,
        });
    } else {
        ElMessage("删除成功, 刷新中");
    }

    await refresh();
}

function isReadOnly(record: CloudflareDnsRecord): boolean {
    // Cloudflare sets meta.read_only = true for R2 bucket / Worker custom domains
    if (record.meta?.readOnly === true) {
        return true;
    }
    // SOA records and locked records are always read-only (managed by Cloudflare)
    if (record.locked === true || record.type === "SOA") {
        return true;
    }
    return false;
}

function displayType(record: CloudflareDnsRecord): string {
    if (record.meta?.r2Bucket) {
        return "R2";
    }
    if (record.meta?.originWorkerId) {
        return "Worker";
    }
    return record.type;
}

function isSelectable(record: CloudflareDnsRecord): boolean {
    return !isReadOnly(record);
}

function handleSelectionChange(selection: CloudflareDnsRecord[]) {
    selectedRecords.value = selection;
}

async function batchEnableCDN() {
    const records = selectedRecords.value.filter((r) => r.proxiable && !r.proxied);
    if (records.length === 0) {
        ElMessage("没有可启用 CDN 的记录");
        return;
    }
    isLoading.value = true;
    const results = await Promise.all(
        records.map((r) => patchRecord(zoneId.value, r.id, { proxied: true })),
    );
    const errors = results.filter((r) => r);
    if (errors.length === 0) {
        ElMessage(`成功启用 ${records.length} 条记录的 CDN`);
    } else {
        ElMessage({
            type: "warning",
            message: `启用 ${records.length - errors.length} 条, 失败 ${errors.length} 条`,
        });
    }
    await refresh();
}

async function batchDisableCDN() {
    const records = selectedRecords.value.filter((r) => r.proxiable && r.proxied);
    if (records.length === 0) {
        ElMessage("没有可禁用 CDN 的记录");
        return;
    }
    isLoading.value = true;
    const results = await Promise.all(
        records.map((r) => patchRecord(zoneId.value, r.id, { proxied: false })),
    );
    const errors = results.filter((r) => r);
    if (errors.length === 0) {
        ElMessage(`成功禁用 ${records.length} 条记录的 CDN`);
    } else {
        ElMessage({
            type: "warning",
            message: `禁用 ${records.length - errors.length} 条, 失败 ${errors.length} 条`,
        });
    }
    await refresh();
}

async function batchDelete() {
    const records = selectedRecords.value;
    if (records.length === 0) {
        return;
    }
    isLoading.value = true;
    const results = await Promise.all(records.map((r) => deleteRecord(r)));
    const errors = results.filter((r) => r);
    if (errors.length === 0) {
        ElMessage(`成功删除 ${records.length} 条记录`);
    } else {
        ElMessage({
            type: "warning",
            message: `删除 ${records.length - errors.length} 条, 失败 ${errors.length} 条`,
        });
    }
    await refresh();
}

const getRecord = computed(() => {
    console.log(record.value);
    return record.value as typeof RecordModal;
});

function displayCreate() {
    getRecord.value.reset();
    getRecord.value.display();
}

function editRecord(record: CloudflareDnsRecord) {
    getRecord.value.reset();
    getRecord.value.display();

    getRecord.value.setModel({
        name: record.name,
        content: record.content,
        type: record.type,
        ttl: record.ttl,
        proxied: record.proxied,
        autoTTL: record.ttl === 1,
        priority: record?.priority,
        comment: record.comment,
        data: {
            port: record.data?.port,
            weight: record.data?.weight,
            target: record.data?.target,
            flags: record.data?.flags,
            tag: record.data?.tag ?? "issue",
            value: record.data?.value ?? "",
            keyTag: record.data?.keyTag,
            algorithm: record.data?.algorithm,
            digestType: record.data?.digestType,
            digest: record.data?.digest,
            protocol: record.data?.protocol ?? 3,
            publicKey: record.data?.publicKey,
            type: record.data?.type,
            certificate: record.data?.certificate,
            fingerprint: record.data?.fingerprint,
            usage: record.data?.usage,
            selector: record.data?.selector,
            matchingType: record.data?.matchingType,
            order: record.data?.order,
            preference: record.data?.preference,
            service: record.data?.service,
            regex: record.data?.regex,
            replacement: record.data?.replacement,
            latDegrees: record.data?.latDegrees,
            latMinutes: record.data?.latMinutes,
            latSeconds: record.data?.latSeconds,
            latDirection: record.data?.latDirection ?? "N",
            longDegrees: record.data?.longDegrees,
            longMinutes: record.data?.longMinutes,
            longSeconds: record.data?.longSeconds,
            longDirection: record.data?.longDirection ?? "E",
            altitude: record.data?.altitude,
            size: record.data?.size,
            precisionHorz: record.data?.precisionHorz,
            precisionVert: record.data?.precisionVert,
        },
    });

    getRecord.value.setRecord(record);
}

loadPage();
</script>

<style scoped>
#create-record-button {
    padding: 0;
}

.card-header {
    display: flex;
    align-items: center;
    gap: 1em;
}

.card-header > span {
    margin: auto 0;
    white-space: nowrap;
}

.card-header > .el-input {
    max-width: 240px;
}

.batch-ops {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: auto;
}

.selection-count {
    font-size: 13px;
    color: #909399;
    white-space: nowrap;
}
</style>
