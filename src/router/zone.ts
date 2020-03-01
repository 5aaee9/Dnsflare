import { RouteConfig } from 'vue-router'
import ZoneList from '@/route/zone/List.vue'
import ZoneRecordList from '@/route/zone/record/List.vue'

export default [{
    name: 'ZoneList',
    component: ZoneList,
    path: '/zone',
    props: true,
}, {
    name: 'ZoneRecordList',
    component: ZoneRecordList,
    path: '/zone/:id',
    props: true,
}] as RouteConfig[]
