<template>
    <div :style="mainStyle">
        <br>
        <el-card v-loading="isLoading">
            <template #header>
                <div style="display: flex">
                    <span>证书信息</span>
                </div>
            </template>

            <span>证书供应商: <el-tag type="info">{{CertificateAuthorityDisplay[certOwner]}}</el-tag></span>
            <br>
            <br>
            <el-select placeholder="Select" v-model="newCertOwner">
                <el-option v-for="(obj, value) in CertificateAuthorityDisplay" :key="value" :label="obj" :value="value" />
            </el-select>
            <el-button @click="modifyCertAuthority" style="margin-left: 10px">修改</el-button>
        </el-card>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { getCertInfo, CertificateAuthorityDisplay, CertificateAuthority, patchCertAuthority } from '@/api/cert'
import { ElMessage } from 'element-plus'

const props = defineProps<{
    zoneId: string
}>()

const isLoading = ref(false)
const mainStyle = ref({})
const certOwner = ref('')
const newCertOwner = ref<CertificateAuthority>('lets_encrypt')

async function loadInfo() {
    isLoading.value = true

    const info = await getCertInfo(props.zoneId)

    if (info.success) {
        certOwner.value = info.result!.certificateAuthority
        newCertOwner.value = info.result!.certificateAuthority
    } else {
        mainStyle.value = {
            display: 'hidden'
        }
    }

    isLoading.value = false
}

async function modifyCertAuthority() {
    isLoading.value = true

    const res = await patchCertAuthority(props.zoneId, newCertOwner.value)
    if (res.success) {
        ElMessage('修改成功, 正在刷新页面')
        await loadInfo()
    } else {
        ElMessage({
            type: 'error',
            message: `修改失败, 错误: ${res.errors[0].message}`,
        })
    }

    isLoading.value = false
}

loadInfo()
</script>
