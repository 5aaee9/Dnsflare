<template>

    <el-breadcrumb separator="/">
        <el-breadcrumb-item>
            Home
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'ZoneList' }">
            Zone 列表
        </el-breadcrumb-item>
        <el-breadcrumb-item>
            Zone 信息
        </el-breadcrumb-item>
    </el-breadcrumb>
    <br>
    <ZoneRecordList :zoneId="zoneId" />
    <CertInfo :zoneId="zoneId" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ZoneRecordList from './record/List.vue'
import CertInfo from './CertInfo.vue'

const route = useRoute()

const zoneId = computed(() => {
    const {id} = route.params

    return id as string
})
</script>
