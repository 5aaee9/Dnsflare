import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "@/router";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "normalize.css/normalize.css";
import "./style.css";
import "virtual:uno.css";

const app = createApp(App);
app.use(ElementPlus);
app.use(router);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
import "./utils/icon";

// const app = new Vue({
//     el: '#app',
//     router,
//     store,
//     components: { App },
//     template: '<App/>',
// })

app.mount("#app");

export default app;
