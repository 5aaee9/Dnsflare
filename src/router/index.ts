import Router from 'vue-router'
import Vue from 'vue'
import LoginComponent from '@/route/Login.vue'
import zoneRoutes from './zone'

Vue.use(Router)

const router =  new Router({
    mode: 'history',
    routes: [{
        name: 'LoginPage',
        component: LoginComponent,
        path: '/',
    }, ...zoneRoutes],
})

export default router
