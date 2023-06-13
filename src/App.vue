<script setup>
import { computed, onMounted, provide, ref, watch } from "vue";
import { useCurrentUser } from "vuefire";
import Hello from "./components/Hello.vue";
import Loading from "./components/Loading.vue";
import Background from "./components/Background.vue";
import Shell from "./components/Shell.vue";
import * as app from "./app/views";
import { requestPermission } from "./auth";
import { useStore } from "vuex";

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

const initialStateSet = ref(false);

/**
 * Starts the process of loading the user from the auth state.
 */
const user = useCurrentUser();

/**
 * Make the user available to the entire app.
 */
provide("user", user);

/**
 * Initial setup of the app, including loading the remote state.
 */
onMounted(() => {
  const store = useStore();

  /**
   * Check the mutation being run and if it's the one that sets the initial state,
   * we can stop showing the loader.
   */
  store.subscribe((mutation) => {
    if (mutation.type === "setInitialState" && mutation.payload.fromServer) {
      initialStateSet.value = true;
    }
  });

  /**
   * When the app loads, we need to fetch the remote state.
   */
  store.dispatch("fetchRemoteState");
});

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
 * Set the qpp badge to the minutes left on the session.
 */
if (navigator.setAppBadge) {
  navigator.setAppBadge(20);
}

/**
 * Decides the main component based on the user state.
 */
const mainComponent = computed(() => {
  /**
   * If we're loading, user is undefined.
   */
  if (loading.value || !initialStateSet.value) {
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
