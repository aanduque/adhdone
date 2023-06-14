import { addAction, addFilter } from '@wordpress/hooks';
import { createApp } from "vue";
import App from "./App.vue";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import HotkeyPlugin from "v-hotkey3";
import FloatingVue from "floating-vue";

import "./assets/main.css";
import "floating-vue/dist/style.css";

window.addAction = (...args) => addAction(...args);
window.addFilter = (...args) => addFilter(...args);

createApp(App)
  .use(autoAnimatePlugin)
  .use(HotkeyPlugin)
  .use(FloatingVue)
  .mount("#app");
