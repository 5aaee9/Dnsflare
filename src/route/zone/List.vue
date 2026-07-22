<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item> Home </el-breadcrumb-item>
            <el-breadcrumb-item> Zone 列表 </el-breadcrumb-item>
        </el-breadcrumb>

        <br />
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>Zone 列表</span>
                    <el-input v-model="filterList" placeholder="输入过滤" @input="updateFilter" />
                    <el-switch
                        v-model="showStarredOnly"
                        active-text="仅星标"
                        @change="onStarFilterChange"
                    />
                </div>
            </template>
            <el-table v-loading="isLoading" :data="filterTableData">
                <el-table-column prop="name" label="域名">
                    <template #default="scope">
                        <el-button
                            text
                            :type="isStarred(scope.row.id) ? 'warning' : 'default'"
                            style="padding: 0; margin-right: 4px"
                            @click.stop="toggleStar(scope.row.id)"
                        >
                            <FontAwesomeIcon
                                icon="star"
                                :style="{ opacity: isStarred(scope.row.id) ? 1 : 0.3 }"
                            />
                        </el-button>
                        {{ scope.row.name }}
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" />
                <el-table-column label="接入商">
                    <template #default="scope">
                        {{ (scope.row.host || { name: "Cloudflare" }).name }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                    <template #default="scope">
                        <el-button size="small" @click.prevent="listZoneRecord(scope.row)">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br />
            <el-pagination
                v-if="!isFullyLoaded"
                :page-size="pageInfo.size"
                :current-page="pageInfo.page"
                layout="prev, pager, next, sizes"
                :total="pageInfo.total"
                style="text-align: center"
                @current-change="changePage"
                @size-change="changeSize"
            />
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { Ref, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { listUserZones, listUserZonesAll } from "../../api/zone";
import { PaginationDetails, convertPagination, fullLoadPages } from "../../utils/pagination";
import { CloudflareZoneRecord, PageSettings } from "@/api";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useStarredZonesStore } from "@/store/starredZones";

defineOptions({ name: "ZoneListPage" });

const filterList: Ref<string> = ref("");
const isLoading: Ref<boolean> = ref(true);
const datas: Ref<CloudflareZoneRecord[]> = ref([]);
const pageInfo: Ref<PaginationDetails> = ref({
    page: 1,
    size: 10,
    total: 0,
});
const router = useRouter();
const isFullyLoaded: Ref<boolean> = ref(false);
const showStarredOnly: Ref<boolean> = ref(false);
const { toggleStar, isStarred } = useStarredZonesStore();
const filterTableData = computed(() => {
    let data = datas.value;

    // 文本过滤
    if (filterList.value.length > 0) {
        data = data.filter((it) => it.name.includes(filterList.value));
    }

    // 星标过滤
    if (showStarredOnly.value) {
        data = data.filter((it) => isStarred(it.id));
    }

    // 排序：星标域名排在最前面
    return [...data].sort((a, b) => {
        const aStar = isStarred(a.id) ? 0 : 1;
        const bStar = isStarred(b.id) ? 0 : 1;
        return aStar - bStar;
    });
});

async function loadPage(page?: PageSettings) {
    isLoading.value = true;
    const zones = await listUserZones(page);

    isLoading.value = false;

    if (zones.result) {
        datas.value = zones.result;
        if (zones.resultInfo) {
            pageInfo.value = convertPagination(zones.resultInfo);
        }
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

function listZoneRecord(data: CloudflareZoneRecord) {
    router.push({
        name: "ZoneRecordList",
        params: {
            id: data.id,
        },
    });
}

async function ensureFullyLoaded() {
    if (isFullyLoaded.value) return;
    if (isLoading.value) return;
    isLoading.value = true;
    const pages = await fullLoadPages(listUserZonesAll);
    pageInfo.value = pages.pageDetail;
    datas.value = pages.data;
    isFullyLoaded.value = true;
    isLoading.value = false;
}

async function updateFilter() {
    await ensureFullyLoaded();
}

async function onStarFilterChange() {
    if (showStarredOnly.value) {
        await ensureFullyLoaded();
    }
}

await loadPage({
    perPage: 10,
    page: 0,
});
</script>

<style scoped>
.card-header {
    display: flex;
    align-items: center;
    gap: 1em;
}

.card-header > .el-input {
    max-width: 240px;
}

.card-header > span {
    margin: auto 0;
}
</style>
