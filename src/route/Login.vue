<template>
    <div class="h-panel login-panel">
        <div class="h-panel-bar">
            <span class="h-panel-title">登录</span>
        </div>
        <div class="h-panel-body">
            <Form
                ref="form"
                :model="model"
                :rules="validationRules"
                :valid-on-change="true"
            >
                <FormItem
                    label="token"
                    prop="token"
                >
                    <template v-slot:label>
                        <i class="h-icon-user" /> Token
                    </template>
                    <input
                        v-model="model.token"
                        type="text"
                    >
                </FormItem>

                <FormItem>
                    <Checkbox v-model="model.save">
                        储存 Token
                    </Checkbox>
                </FormItem>

                <FormItem>
                    <Button
                        color="primary"
                        :loading="isLoading"
                        @click="submit"
                    >
                        提交
                    </Button>&nbsp;&nbsp;&nbsp;
                    <Button @click="reset">
                        重置
                    </Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { userTokenVerify } from '../api/account'
import { UserModule } from '../store/module'

@Component({})
export default class LoginRoute extends Vue {
    private readonly validationRules = {
        rules: {
            token: {
                maxLen: 40,
                minLen: 40,
            },
        },
        required: ['token'],
    }

    private model = {
        token: '',
        save: false,
    }

    private isLoading: boolean = false

    async submit() {
        this.isLoading = true
        const validResult = (this.$refs.form as any).valid()

        if (validResult.result) {
            const status = await userTokenVerify(this.model.token)

            if (status) {
                // Token verify passed
                UserModule.login(this.model)
                this.$Message('登录成功, 即将跳转管理页面')
            } else {
                this.$Message({
                    type: 'error',
                    text: 'Token 错误',
                })
            }

            this.isLoading = false
        } else {
            this.isLoading = false
        }
    }

    reset() {
        this.model.token = ''
        this.model.save = false
    }
}
</script>

<style lang="scss" scoped>
    .login-panel {
        margin: auto;
        margin-top: 20px;
        max-width: 400px;
    }
</style>
