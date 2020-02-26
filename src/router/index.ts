import Router from 'vue-router'
import Vue from 'vue'
import LoginComponent from '@/route/Login.vue'

Vue.use(Router)

const router =  new Router({
    mode: 'history',
    routes: [{
        name: 'LoginPage',
        component: LoginComponent,
        path: '/',
    }],
})

export default router
