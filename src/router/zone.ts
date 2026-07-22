import type { RouteRecordRaw } from "vue-router";
import ZoneList from "@/route/zone/List.vue";
import ZoneInfoRoute from "@/route/zone/ZoneInfo.vue";

const routes: RouteRecordRaw[] = [
    {
        name: "ZoneList",
        component: ZoneList,
        path: "/zone",
        props: true,
    },
    {
        name: "ZoneRecordList",
        component: ZoneInfoRoute,
        path: "/zone/:id",
        props: true,
    },
];

export default routes;
