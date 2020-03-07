import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import './styles/global.scss'
import ElementUI from 'element-ui'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import './utils/icon'
Vue.use(ElementUI)
Vue.component('FontAwesomeIcon', FontAwesomeIcon)

const app = new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>',
})

export default app
