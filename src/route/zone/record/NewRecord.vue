<template>
    <div>
        <header class="h-modal-header">
            新建 Record
        </header>

        <Form
            ref="form"
            :model="model"
            :rules="validationRules"
            :valid-on-change="true"
        >
            <FormItem
                label="name"
                prop="name"
            >
                <template v-slot:label>
                    <FontAwesomeIcon
                        class="h-icon-fontawesome"
                        icon="file"
                    /> 名称
                </template>
                <input
                    v-model="model.name"
                    type="text"
                >
            </FormItem>
            <FormItem
                label="value"
                prop="value"
            >
                <template v-slot:label>
                    <FontAwesomeIcon
                        icon="font"
                        class="h-icon-fontawesome"
                    /> 目标
                </template>
                <input
                    v-model="model.value"
                    type="text"
                >
            </FormItem>
            <FormItem
                v-if="model.type === 'MX' || model.type === 'SRV'"
                label="priority"
                prop="priority"
            >
                <template v-slot:label>
                    <FontAwesomeIcon
                        icon="sort-numeric-up"
                        class="h-icon-fontawesome"
                    /> 优先级
                </template>
                <input
                    v-model="model.priority"
                    type="text"
                >
            </FormItem>
            <FormItem
                label="type"
                prop="type"
            >
                <template v-slot:label>
                    <FontAwesomeIcon
                        icon="globe-asia"
                        class="h-icon-fontawesome"
                    /> 类型
                </template>
                <Select
                    v-model="model.type"
                    autosize
                    :datas="dnsTypes"
                />
            </FormItem>
            <FormItem
                label="ttl"
                prop="ttl"
            >
                <template v-slot:label>
                    <FontAwesomeIcon
                        icon="clock"
                        class="h-icon-fontawesome"
                    /> TTL
                </template>
                <input
                    v-model="model.ttl"
                    :disabled="model.autoTTL"
                    type="text"
                >
                <Checkbox v-model="model.autoTTL">
                    自动 TTL
                </Checkbox>
            </FormItem>
            <FormItem
                label="proxied"
                prop="proxied"
            >
                <template v-slot:label>
                    <FontAwesomeIcon
                        icon="cloud"
                        class="h-icon-fontawesome"
                    /> 代理
                </template>
                <Checkbox v-model="model.proxied">
                    Cloudflare CDN
                </Checkbox>
            </FormItem>
            <FormItem>
                <Button
                    color="primary"
                    :loading="isLoading"
                    @click="createRecord"
                >
                    提交
                </Button>&nbsp;&nbsp;&nbsp;
                <Button @click="close">
                    取消
                </Button>
            </FormItem>
        </Form>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DnsRecordTypeEnum } from '@/api/enum'
import { createDnsRecord } from '@/api/dns'
import { DnsRecordType } from '@/api'

@Component({})
export default class NewRecordModal extends Vue {
    @Prop({ type: String })
    private readonly zone!: string
    private readonly validationRules = {
        rules: {
        },
        required: ['name', 'value', 'type', 'ttl'],
    }
    readonly model = {
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

    close() {
        this.$emit('close')
    }

    async createRecord() {
        this.isLoading = true

        const validResult = (this.$refs.form as any).valid()

        if (validResult.result) {
            const res = await createDnsRecord(this.zone, {
                name: this.model.name,
                content: this.model.value,
                type: this.model.type,
                ttl: (this.model.autoTTL) ? 1 : this.model.ttl,
                proxied: this.model.proxied,
            })

            if (!res) {
                this.$emit('success')
                this.$Message('创建成功, 正在刷新')
                this.$emit('close')
            } else {
                this.$Message({
                    type: 'error',
                    text: `创建失败, 消息: ${res}`,
                })
            }
        }

        this.isLoading = false
    }
}
</script>
