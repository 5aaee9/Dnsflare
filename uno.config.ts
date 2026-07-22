import { defineConfig } from "unocss";
// import presetIcons from '@unocss/preset-icons'
import presetWind from "@unocss/preset-wind3";

export default defineConfig({
    presets: [presetWind()],
    blocklist: ["container"],
});
