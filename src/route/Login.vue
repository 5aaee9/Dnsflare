<template>
    <el-card class="box-card">
        <div
            slot="header"
            class="clearfix"
        >
            <span>登录</span>
        </div>
        <el-form
            ref="form"
            :model="model"
            :rules="validationRules"
            label-width="120px"
        >
            <el-form-item
                label="Token"
                prop="token"
            >
                <el-input v-model="model.token" />
            </el-form-item>
            <el-form-item label="储存 Token">
                <el-switch v-model="model.save" />
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    :loading="isLoading"
                    @click="submit"
                >
                    提交
                </el-button>
                <el-button @click="reset">
                    重置
                </el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { userTokenVerify } from '../api/account'
import { UserModule } from '../store/module'
import { ValidForm } from '@/utils/annotations'

@Component({})
export default class LoginRoute extends Vue {
    private readonly validationRules = {
        token: [
            { required: true, message: '请输入 Cloudflare 的 Token', trigger: 'blur' },
            { min: 40, max: 40, message: '不是一个合法的 Token 长度', trigger: 'blur' },
        ],
    }

    private model = {
        token: '',
        save: false,
    }

    private isLoading: boolean = false

    mounted() {
        // Clean token
        if (!UserModule.saveToken) {
            UserModule.setToken('')
        }

        this.model.token = UserModule.token
        this.model.save = UserModule.saveToken
    }

    @ValidForm('form')
    async submit() {
        this.isLoading = true
        const status = await userTokenVerify(this.model.token)

        if (status) {
            // Token verify passed
            UserModule.login(this.model)
            this.$message('登录成功, 即将跳转管理页面')

            setTimeout(() => {
                this.$router.push({ name: 'ZoneList' })
            }, 1000)
        } else {
            this.$message({
                type: 'error',
                message: 'Token 错误',
            })
        }

        this.isLoading = false
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
