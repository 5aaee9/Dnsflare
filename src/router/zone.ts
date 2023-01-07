import { RouteConfig } from 'vue-router'
import ZoneList from '@/route/zone/List.vue'
import ZoneInfoRoute from '@/route/zone/ZoneInfo.vue'

export default [{
    name: 'ZoneList',
    component: ZoneList,
    path: '/zone',
    props: true,
}, {
    name: 'ZoneRecordList',
    component: ZoneInfoRoute,
    path: '/zone/:id',
    props: true,
}] as RouteConfig[]
