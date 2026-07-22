import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [UnoCSS(), vue()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        minify: "oxc",
        rolldownOptions: {
            output: {
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`,
            },
        },
    },
    server: {
        allowedHosts: ["5175--main--base--indexyz.workspace.wanix.net"],
        proxy: {
            "/api": {
                target: "https://api.cloudflare.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, "/client/v4"),
            },
        },
    },
});
