<script setup>
import { computed, provide, ref, watch } from "vue";
import { useCurrentUser } from "vuefire";
import Hello from "./components/Hello.vue";
import Loading from "./components/Loading.vue";
import Background from "./components/Background.vue";
import Shell from "./components/Shell.vue";
import * as app from "./app/index";
import { requestPermission } from "./auth";

/**
 * Provide the app structure to the rest of tree.
 * This will include things like menu descriptions, text strings,
 * and other things we use to create describe the interface.
 */
provide("app", app);

/**
 * When the app mounts, we are still waiting for the user to be authenticated.
 * We need to control that flow to decide what screens to show and if the loader
 * should be visible.
 */
const loading = ref(true);

/**
 * Starts the process of loading the user from the auth state.
 */
const user = useCurrentUser();

/**
 * Make the user available to the entire app.
 */
provide("user", user);

/**
 * When the user is loaded, we can stop showing the loader.
 */
watch(user, (user) => {
  loading.value = false;

  /**
   * Ask for the user permission to send notifications.
   */
  requestPermission(user);
});

/**
 * Decides the main component based on the user state.
 */
const mainComponent = computed(() => {
  /**
   * If we're loading, user is undefined.
   */
  console.log(loading.value, user);
  if (loading.value) {
    return Loading;
  }

  /**
   * If we have a user, show the Home screen.
   * Otherwise, show the Login screen.
   */
  if (user.value?.uid) {
    return Shell;
  } else {
    return Hello;
  }
});
</script>

<template>
  <Background v-auto-animate>
    <component :is="mainComponent" />
  </Background>
</template>

<style>
.v-popper__inner {
  @apply text-xs;
}
</style>
