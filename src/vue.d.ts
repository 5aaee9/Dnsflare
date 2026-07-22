/// <reference types="vite/client" />

declare module "*.vue" {
    import { DefineComponent } from "vue";
    const component: DefineComponent<object, object, unknown>;
    export default component;
}
