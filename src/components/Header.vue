<template>
    <el-header
        style="background-color: rgb(238, 241, 246);"
    >
        <div class="container app-header">
            <el-link href="https://github.com/Indexyz/Dnsflare">
                Dnsflare
            </el-link>
            <div class="header-right">
                <el-link
                    v-if="!displayLogout"
                    :to="{ name: 'LoginPage' }"
                >
                    登录
                </el-link>
                <el-dropdown
                    v-else
                    @command="handleCommand"
                >
                    <i
                        class="el-icon-setting"
                    />
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="logout">
                            登出
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </el-header>
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { UserModule } from '../store/module'

type HeaderCommand = 'logout'

@Component({})
export default class HeaderComponent extends Vue {
    get displayLogout(): boolean {
        return this.$route.name !== 'LoginPage'
    }

    onLogout() {
        UserModule.setToken('')
        this.$router.push({ name: 'LoginPage' })
    }

    handleCommand(command: HeaderCommand) {
        switch (command) {
            case 'logout': {
                this.onLogout()
                break
            }
            default: { }
        }
    }
}
</script>

<style lang="scss" scoped>
    @mixin item {
        margin: auto 0;
        cursor: pointer;
        transition: .3s;

        text-decoration: none;

        &:hover {
            color: #77A2DC;
        }
    }


    .app-header {
        padding: 0px;
        line-height: 60px;
        display: flex;

        p,a {
            @include item;
        }

        .header-right {
            margin-left: auto;
            display: flex;
        }
    }
</style>
