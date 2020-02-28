<template>
    <Layout
        id="app"
        :header-fixed="true"
    >
        <AppHeader />
        <Content style="padding: 0px 50px;">
            <router-view />
        </Content>
    </layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import AppHeader from '@/components/Header.vue'

@Component({
    components:{ AppHeader },
})
export default class Application extends Vue { }
</script>
