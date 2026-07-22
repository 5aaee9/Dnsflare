<template>
    <el-header style="background-color: rgb(238, 241, 246)">
        <div class="container app-header">
            <el-link href="https://github.com/Indexyz/Dnsflare"> Dnsflare </el-link>
            <div class="header-right">
                <el-link v-if="!displayLogout" :to="{ name: 'LoginPage' }"> 登录 </el-link>
                <el-dropdown
                    v-else
                    style="margin-top: auto; margin-bottom: auto; font-size: 16px; cursor: pointer"
                    @command="handleCommand"
                >
                    <FontAwesomeIcon icon="gear" />
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="logout"> 登出 </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </el-header>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useUserStore } from "@/store/user";
import { useRouter, useRoute } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineOptions({ name: "AppHeader" });

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const displayLogout = computed(() => {
    return route.name !== "LoginPage";
});

type HeaderCommand = "logout";

function handleCommand(command: HeaderCommand) {
    switch (command) {
        case "logout": {
            userStore.logout();
            router.push({ name: "LoginPage" });
            break;
        }
        default: {
            break;
        }
    }
}
</script>

<style scoped>
.app-header {
    padding: 0px;
    line-height: 60px;
    display: flex;
}

.app-header p,
.app-header a {
    margin: auto 0;
    cursor: pointer;
    transition: 0.3s;
    text-decoration: none;
}

.app-header p:hover,
.app-header a:hover {
    color: #77a2dc;
}

.app-header .header-right {
    margin-left: auto;
    display: flex;
}
</style>
