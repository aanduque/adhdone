import { createApp } from "vue";
import App from "./App.vue";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import HotkeyPlugin from "v-hotkey3";
import FloatingVue from "floating-vue";
import store from "./store";
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './firebase'
import Vue3TouchEvents from "vue3-touch-events";
export { addAction, addFilter } from "@wordpress/hooks";

/**
 * Loads the main styles, including tailwind.
 */
import "./assets/main.css";
import "floating-vue/dist/style.css";

/**
 * Configure VueFire
 */
const vueFireConfig = {
  firebaseApp,
  modules: [
    VueFireAuth(),
  ],
}

/**
 * Custom directive to focus an element,
 * when it is mounted.
 */
const focus = {
  mounted: (el) => el.focus()
}

/**
 * That's it, let's start the app!
 */
createApp(App)
  .use(autoAnimatePlugin)
  .use(HotkeyPlugin)
  .use(FloatingVue)
  .use(store)
  .use(VueFire, vueFireConfig)
  .use(Vue3TouchEvents)
  .directive('focus', focus)
  .mount("#app");
