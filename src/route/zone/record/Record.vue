<template>
    <el-dialog
        :title="`${modeLocale} Record`"
        :visible.sync="dialogVisible"
        class="container"
        :before-close="handleClose"
    >
        <div>
            <el-form
                ref="form"
                label-width="120px"
                :model="model"
                :rules="validationRules"
            >
                <el-form-item
                    prop="name"
                >
                    <span slot="label">
                        <FontAwesomeIcon
                            icon="file"
                        /> 名称
                    </span>
                    <el-input v-model="model.name" />
                </el-form-item>
                <el-form-item
                    prop="value"
                >
                    <span slot="label">
                        <FontAwesomeIcon
                            icon="font"
                        /> 目标
                    </span>
                    <el-input v-model="model.value" />
                </el-form-item>
                <el-form-item
                    v-if="model.type === 'MX' || model.type === 'SRV'"
                    prop="priority"
                >
                    <span slot="label">
                        <FontAwesomeIcon
                            icon="sort-numeric-up"
                        /> 优先级
                    </span>
                    <el-input v-model="model.priority" />
                </el-form-item>
                <el-form-item
                    prop="type"
                >
                    <span slot="label">
                        <FontAwesomeIcon
                            icon="globe-asia"
                        /> 类型
                    </span>
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
                    <span slot="label">
                        <FontAwesomeIcon
                            icon="clock"
                        /> TTL
                    </span>
                    <el-input
                        v-model="model.ttl"
                        :disabled="model.autoTTL"
                    />
                    <el-switch
                        v-model="model.autoTTL"
                        active-text="自动 TTL"
                    />
                </el-form-item>
                <el-form-item
                    prop="proxied"
                >
                    <span slot="label">
                        <FontAwesomeIcon
                            icon="cloud"
                        /> 代理
                    </span>
                    <el-checkbox v-model="model.proxied">
                        Cloudflare CDN
                    </el-checkbox>
                </el-form-item>
            </el-form>
        </div>
        <span
            slot="footer"
            class="dialog-footer"
        >
            <el-button
                type="primary"
                :loading="isLoading"
                @click="createRecord"
            >保存</el-button>
            <el-button @click="handleClose">取消</el-button>
        </span>
    </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DnsRecordTypeEnum } from '@/api/enum'
import { createDnsRecord, putRecord } from '@/api/dns'
import { DnsRecordType, CloudflareDnsRecord } from '@/api'
import { ValidForm } from '@/utils/annotations'


@Component({})
export default class RecordModal extends Vue {
    dialogVisible: boolean = false
    record: CloudflareDnsRecord | null = null

    display() {
        this.dialogVisible = true
    }

    handleClose() {
        this.dialogVisible = false
        this.$emit('close')
    }

    @Prop({ type: String })
    private readonly zone!: string
    private readonly validationRules = {
        name: [{ required: true, message: '请输入记录名称', trigger: 'blur' } ],
        value: [{ required: true, message: '请输入记录值', trigger: 'blur' } ],
        ttl: [{ required: true, message: '请输入记录 TTL', trigger: 'blur' } ],
        type: [{ required: true, message: '请输入记录类型', trigger: 'blur' } ],
    }

    model = {
        name: '',
        value: '',
        type: 'A' as DnsRecordType,
        ttl: 300,
        autoTTL: true,
        proxied: false,
        priority: 0,
    }

    private isLoading = false

    get dnsTypes() {
        return Object.keys(DnsRecordTypeEnum)
    }

    get modeLocale(): string {
        return this.isEditMode ? '修改' : '新建'
    }

    @ValidForm('form')
    async createRecord() {
        this.isLoading = true

        const submit = async doc => {
            if (this.isEditMode) {
                return await putRecord(this.record!, doc)
            } else {
                return await createDnsRecord(this.zone, doc)
            }
        }

        const res = await submit({
            name: this.model.name,
            content: this.model.value,
            type: this.model.type,
            ttl: (this.model.autoTTL) ? 1 : this.model.ttl,
            proxied: this.model.proxied,
        })

        if (!res) {
            this.$emit('success')
            this.$message(`${this.modeLocale}成功, 正在刷新`)
            this.handleClose()
        } else {
            this.$message({
                type: 'error',
                message: `${this.modeLocale}失败, 消息: ${res}`,
            })
        }

        this.isLoading = false
    }


    setRecord(record: CloudflareDnsRecord) {
        this.record = record
    }

    get isEditMode(): boolean {
        return !!this.record
    }

    setModel(m) {
        this.model = Object.assign(this.model, m)
    }
}
</script>
