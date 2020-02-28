import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import './styles/global.scss'
import HeyUI from 'heyui'

Vue.use(HeyUI)

const app = new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>',
})

export default app
