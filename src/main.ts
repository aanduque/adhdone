import { createApp, nextTick } from "vue";
import App from "./App.vue";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import HotkeyPlugin from "v-hotkey3";
import FloatingVue from "floating-vue";
import store from "./store";
import { VueFire, VueFireAuth } from 'vuefire'
import { firebaseApp } from './firebase'
import Vue3TouchEvents from "vue3-touch-events";
import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify';
import { plugin, defaultConfig } from '@formkit/vue'
import config from '../formkit.config'
export { addAction, addFilter } from "@wordpress/hooks";

/**
 * Loads the main styles, including tailwind.
*/
import "./assets/main.css";
import "floating-vue/dist/style.css";
import 'vue3-toastify/dist/index.css';
import { throttle } from "lodash";

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
 * Scroll to element that was just added.
 */
const scrollTo = {
  mounted: (el, { value }) => {
    console.log('scrollTo', el, value)
    if (!value) {
      return;
    }
    nextTick(() => {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth" })
      }, 300);
    })
  }
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
  .use(plugin, defaultConfig(config))
  .use(Vue3Toasity,
    {
      autoClose: 3000,
    } as ToastContainerOptions)
  .directive('focus', focus)
  .directive('scrollTo', scrollTo)
  .mount("#app");
