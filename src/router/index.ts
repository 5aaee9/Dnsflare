import * as VueRouter from 'vue-router'
import LoginComponent from '@/route/Login.vue'
import zoneRoutes from './zone'


const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes: [{
        name: 'LoginPage',
        component: LoginComponent,
        path: '/',
    }, ...zoneRoutes],
})

export default router
