import Vue from 'vue'
import App from './App.vue'
import router from '@/router'

const app = new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
})

export default app
