import { RouteConfig } from 'vue-router'
import ZoneList from '@/route/zone/List.vue'

export default [{
    name: 'ZoneList',
    component: ZoneList,
    path: '/zone',
    props: true,
}] as RouteConfig[]
