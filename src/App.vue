<template>
    <div>
        <AppHeader />
        <br>
        <el-main class="container">
            <Suspense>
                <router-view />
            </Suspense>
        </el-main>
    </div>
</template>

<script lang="ts" setup>
import AppHeader from '@/components/Header.vue'

</script>
