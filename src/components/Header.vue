<template>
    <el-header
        style="background-color: rgb(238, 241, 246);"
    >
        <div class="container app-header">
            <a href="https://github.com/Indexyz/Dnsflare">Dnsflare</a>
            <div class="header-right">
                <router-link
                    v-if="!displayLogout"
                    :to="{ name: 'LoginPage' }"
                >
                    登录
                </router-link>
            </div>
        </div>
    </el-header>
    <!-- <HHeader
        theme="dark"
        class="app-header"
    >
        <p>Dnsflare</p>
        <div class="header-right">
            <a href="https://github.com/Indexyz/Dnsflare">GitHub</a>
            <a
                v-if="displayLogout"
                @click="onLogout"
            >登出</a>
        </div>
    </HHeader> -->
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { UserModule } from '../store/module'

@Component({})
export default class HeaderComponent extends Vue {
    get displayLogout(): boolean {
        return this.$route.name !== 'LoginPage'
    }

    onLogout() {
        UserModule.setToken('')
        this.$router.push({ name: 'LoginPage' })
    }
}
</script>

<style lang="scss" scoped>
    @mixin item {
        margin: auto 0;
        cursor: pointer;
        transition: .3s;

        padding: 0 30px;
        text-decoration: none;

        &:hover {
            color: #77A2DC;
        }
    }


    .app-header {
        line-height: 60px;
        display: flex;
        padding-left: 40px;

        p,a {
            @include item;
        }

        .header-right {
            margin-left: auto;
            margin-right: 40px;
            display: flex;
        }
    }
</style>
