<template>
    <div>
        <AppHeader />
        <br>
        <el-main class="container">
            <router-view />
        </el-main>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import AppHeader from '@/components/Header.vue'

@Component({
    components:{ AppHeader },
})
export default class Application extends Vue { }
</script>
