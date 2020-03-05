<template>
    <HHeader
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
    </HHeader>
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

        &:hover {
            color: #77A2DC;
        }
    }


    .app-header {
        display: flex;
        padding-left: 40px;

        > p {
            @include item;
        }

        .header-right {
            margin-left: auto;
            margin-right: 40px;
            display: flex;

            > * {
                @include item;
            }
        }
    }
</style>
