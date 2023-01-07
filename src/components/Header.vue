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
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="logout">
                                登出
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </el-header>
</template>


<script lang="ts" setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/user'
import { useRouter, useRoute } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const displayLogout = computed(() => {
    return route.name !== 'LoginPage'
})

type HeaderCommand = 'logout'

function handleCommand(command: HeaderCommand) {
    switch (command) {
        case 'logout': {
            userStore.logout()
            router.push({ name: 'LoginPage' })
            break
        }
        default: { break }
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
