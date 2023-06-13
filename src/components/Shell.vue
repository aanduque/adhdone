<script setup lang="ts">
import ProgressBar from "./ProgressBar.vue";
import Header from "./Shell/Header.vue";
import PageHeader from "./PageHeader.vue";
import ActiveTaskBar from "./ActiveTaskBar.vue";
import PageNavigator from "./PageNavigator.vue";
import CommandBar from "./CommandBar.vue";
import Settings from "./Settings.vue";
import { useStore } from "vuex";
import { computed, provide, ref } from "vue";

const { getters } = useStore();

/**
 * Setup the command bar.
 */
const commandBarOpen = ref(false);

const settingsScreen = ref({
  screenName: null,
  object: null,
});

const settings = computed({
  get: () => settingsScreen.value,
  set: (screen) => (settingsScreen.value = screen),
});

provide("settings", settings);

const keymap = {
  "ctrl+shift+o": () => (commandBarOpen.value = !commandBarOpen.value),
};
</script>

<template>
  <div class="min-h-full bg-gray-100" v-hotkey="keymap">
    <Header />
    <ProgressBar
      :completed="getters.completedTasks"
      :total="getters.totalTasks"
    />
    <PageHeader />
    <PageNavigator />
    <CommandBar
      :open="commandBarOpen"
      @close="() => (commandBarOpen = false)"
    />
    <Teleport to="#modals">
      <ActiveTaskBar />
      <Settings :screen="settings" @close="settings.screenName = null" />
    </Teleport>
  </div>
</template>
