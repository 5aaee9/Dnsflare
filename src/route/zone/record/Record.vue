<template>
    <el-dialog
        :title="`${modeLocale} Record`"
        :model-value="dialogVisible"
        class="container"
        width="unset"
        @update:model-value="handleClose"
    >
        <div>
            <el-form
                ref="ruleFormRef"
                label-width="120px"
                :model="model"
                :rules="validationRules"
            >
                <el-form-item
                    prop="name"
                >
                    <template #label>
                        <span>
                            <FontAwesomeIcon
                                icon="file"
                            /> 名称
                        </span>
                    </template>
                    <el-input v-model="model.name" />
                </el-form-item>
                <el-form-item
                    v-if="!isSRV && !isCAA"
                    prop="content"
                >

                    <template #label>
                        <span>
                            <FontAwesomeIcon
                                icon="font"
                            /> 目标
                        </span>
                    </template>
                    <el-input v-model="model.content" />
                </el-form-item>
                <el-form-item
                    v-if="isCAA"
                    prop="data.flags"
                >
                    <template #label>
                        <span>
                            <FontAwesomeIcon icon="flag" /> Flags
                        </span>
                    </template>
                    <el-input-number
                        v-model="model.data.flags"
                        :min="0"
                        :max="255"
                    />
                </el-form-item>
                <el-form-item
                    v-if="isCAA"
                    prop="data.tag"
                >
                    <template #label>
                        <span>
                            <FontAwesomeIcon icon="tag" /> Tag
                        </span>
                    </template>
                    <el-select
                        v-model="model.data.tag"
                        allow-create
                        filterable
                        placeholder="选择或输入"
                    >
                        <el-option label="issue" value="issue" />
                        <el-option label="issuewild" value="issuewild" />
                        <el-option label="iodef" value="iodef" />
                    </el-select>
                </el-form-item>
                <el-form-item
                    v-if="isCAA"
                    prop="data.value"
                >
                    <template #label>
                        <span>
                            <FontAwesomeIcon icon="font" /> Value
                        </span>
                    </template>
                    <el-input v-model="model.data.value" />
                </el-form-item>
                <el-form-item
                    v-if="requirePriority"
                    prop="priority"
                >
                    <template #label>
                        <span>
                            <FontAwesomeIcon
                                icon="sort-numeric-up"
                            /> 优先级
                        </span>
                    </template>
                    <el-input-number v-model="model.priority" />
                </el-form-item>
                <el-form-item
                    v-if="isSRV"
                    prop="weight"
                >
                    <template #label>
                        <span>
                            <FontAwesomeIcon
                                icon="sort-numeric-up"
                            /> 权重
                        </span>
                    </template>
                    <el-input-number v-model="model.data.weight" />
                </el-form-item>
                <el-form-item
                    v-if="isSRV"
                    prop="port"
                >
                    <template #label>
                        <span>
                            <FontAwesomeIcon
                                icon="sort-numeric-up"
                            /> 端口
                        </span>
                    </template>
                    <el-input-number v-model="model.data.port" />
                </el-form-item>
                <el-form-item
                    v-if="isSRV"
                    prop="target"
                >
                    <template #label>
                        <span>
                            <FontAwesomeIcon
                                icon="font"
                            /> 目标
                        </span>
                    </template>
                    <el-input v-model="model.data.target" />
                </el-form-item>
                <el-form-item
                    prop="type"
                >
                    <template #label>
                        <span>
                            <FontAwesomeIcon
                                icon="globe-asia"
                            /> 类型
                        </span>
                    </template>
                    <el-select
                        v-model="model.type"
                        placeholder="选择"
                    >
                        <el-option
                            v-for="(item, index) in dnsTypes"
                            :key="index"
                            :label="item"
                            :value="item"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    prop="ttl"
                >
                    <template #label>
                        <span>
                            <FontAwesomeIcon
                                icon="clock"
                            /> TTL
                        </span>
                    </template>
                    <div style="display: grid; grid-row-gap: 10px;">
                        <el-input-number
                            v-model="model.ttl"
                            :disabled="model.autoTTL"
                        />

                        <el-switch
                            v-model="model.autoTTL"
                            active-text="自动 TTL"
                        />
                    </div>
                </el-form-item>
                <el-form-item
                    v-if="!isCAA"
                    prop="proxied"
                >
                    <template #label>
                        <span>
                            <FontAwesomeIcon
                                icon="cloud"
                            /> 代理
                        </span>
                    </template>
                    <el-checkbox v-model="model.proxied">
                        Cloudflare CDN
                    </el-checkbox>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button
                    type="primary"
                    :loading="isLoading"
                    @click="createRecord"
                >保存</el-button>
                <el-button @click="handleClose">取消</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, Ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
// import { Vue, Component, Prop } from 'vue-property-decorator'
import { DnsRecordTypeEnum } from '@/api/enum'
import { createDnsRecord, putRecord } from '@/api/dns'
import { DnsRecordType, CloudflareDnsRecord } from '@/api'
import type { FormInstance, FormRules } from 'element-plus'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineOptions({ name: 'DnsRecordModal' })
const ruleFormRef = ref<FormInstance>()
const emits = defineEmits<{
  (event: 'close'): void
  (event: 'success'): void
}>()


const props = withDefaults(defineProps<{
    zone: string
}>(), {

})

type RecordModalType = {
    name: string
    content?: string
    type: DnsRecordType
    ttl: number
    autoTTL?: boolean
    proxied: boolean
    priority?: number
    data: RecordData
}

type RecordData = {
    weight?: number
    port?: number
    target?: string
    priority?: number
    flags?: number
    tag?: string
    value?: string
}

type RecordRequest = Omit<RecordModalType, 'data'> & {
    data?: RecordData
}

const DefaultModalValue: RecordModalType = {
    name: '',
    content: '',
    type: 'A' as DnsRecordType,
    ttl: 300,
    autoTTL: true,
    proxied: false,
    priority: 0,
    data: {
        weight: 0,
        port: 0,
        target: '',
        priority: 0,
        flags: 0,
        tag: 'issue',
        value: '',
    },
}

const isLoading = ref(false)
const dialogVisible = ref(false)
const record: Ref<CloudflareDnsRecord | null> = ref(null)

const model = ref(DefaultModalValue)

const requirePriority = computed(() => {
    return model.value.type === 'MX' || model.value.type === 'SRV'
})

const isSRV = computed(() => {
    return model.value.type === 'SRV'
})

const isCAA = computed(() => {
    return model.value.type === 'CAA'
})

const dnsTypes = computed(() => {
    return Object.keys(DnsRecordTypeEnum)
})

const isEditMode = computed(() => {
    return !!record.value
})

const modeLocale = computed(() => {
    return isEditMode.value ? '修改' : '新建'
})

function display() {
    dialogVisible.value = true
}

function handleClose() {
    dialogVisible.value = false
    emits('close')
}


const validationRules = reactive<FormRules>({
    name: [{ required: true, message: '请输入记录名称', trigger: 'blur' } ],
    content: [{
        validator: (_rule: unknown, value: unknown, callback: (error?: Error) => void) => {
            if (isCAA.value || value) {
                callback()
            } else {
                callback(new Error('请输入记录值'))
            }
        },
        trigger: 'blur',
    }],
    'data.flags': [
        { required: true, message: '请输入 CAA Flags', trigger: 'blur' },
        { type: 'number', min: 0, max: 255, message: 'CAA Flags 需要是 0 到 255 之间的数字', trigger: 'blur' },
    ],
    'data.tag': [{ required: true, message: '请输入 CAA Tag', trigger: 'blur' }],
    'data.value': [{ required: true, message: '请输入 CAA Value', trigger: 'blur' }],
    ttl: [
        { required: true, message: '请输入记录 TTL', trigger: 'blur' },
        { type: 'number', message: 'TTL 需要是一个数字', trigger: 'blur' },
    ],
    type: [{ required: true, message: '请输入记录类型', trigger: 'blur' } ],
})

function setRecord(r: CloudflareDnsRecord) {
    record.value = r
}

function reset() {
    model.value = Object.assign({}, DefaultModalValue)
    record.value = null
}

function setModel(m: Partial<RecordModalType>) {
    model.value = Object.assign(model.value, m)
}

async function createRecord() {
    const valid = await ruleFormRef.value?.validate()
    if (!valid) {
        return
    }

    isLoading.value = true

    const submit = async (doc: RecordRequest) => {
        if (isEditMode.value) {
            if (!record.value) {
                return
            }
            return await putRecord(props.zone, record.value.id, doc)
        } else {
            return await createDnsRecord(props.zone, doc)
        }
    }

    const requestBody: RecordRequest = {
        name: model.value.name,
        type: model.value.type,
        ttl: (model.value.autoTTL) ? 1 : model.value.ttl,
        proxied: isCAA.value ? false : model.value.proxied,
    }

    if (!isCAA.value) {
        requestBody.content = model.value.content
    }

    if (requirePriority.value) {
        requestBody.priority = model.value.priority
    }
    if (isSRV.value) {
        requestBody.data = {
            port: model.value.data.port,
            weight: model.value.data.weight,
            target: model.value.data.target,
            priority: model.value.priority
        }
    }
    if (isCAA.value) {
        requestBody.data = {
            flags: model.value.data.flags ?? 0,
            tag: model.value.data.tag ?? 'issue',
            value: model.value.data.value ?? '',
        }
    }

    const res = await submit(requestBody)

    if (!res) {
        emits('success')
        ElMessage(`${modeLocale.value}成功, 正在刷新`)
        handleClose()
    } else {
        ElMessage({
            type: 'error',
            message: `${modeLocale.value}失败, 消息: ${res}`,
        })
    }

    isLoading.value = false
}

defineExpose({
    display,
    reset,
    setModel,
    setRecord,
})
</script>
