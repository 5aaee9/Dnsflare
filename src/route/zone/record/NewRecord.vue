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
                        icon="cloud"
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
import { Vue, Component } from 'vue-property-decorator'
import { DnsRecordTypeEnum } from '@/api/enum'

@Component({})
export default class NewRecordModal extends Vue {
    private readonly validationRules = {
        rules: {
        },
        required: ['name', 'value', 'type', 'ttl'],
    }
    readonly model = {
        name: '',
        value: '',
        ttl: 300,
        autoTTL: true,
    }
    private isLoading = false

    get dnsTypes() {
        return Object.keys(DnsRecordTypeEnum)
    }

    close() {
        this.$emit('close')
    }

    createRecord() {
        this.$emit('success')
    }
}
</script>
