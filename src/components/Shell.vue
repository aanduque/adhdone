<script setup lang="ts">
import ProgressBar from "./ProgressBar.vue";
import Header from "./Shell/Header.vue";
import PageHeader from "./PageHeader.vue";
import ActiveTaskBar from "./ActiveTaskBar.vue";
import PageNavigator from "./PageNavigator.vue";
import CommandBar from "./CommandBar.vue";
import Settings from "./Settings.vue";
import EditTask from "./settings/EditTask.vue";
import { useStore } from "vuex";
import { computed, ref } from "vue";

const { state, commit, getters } = useStore();

const { currentSession, settings, categories } = state;

const currentTask = computed(() => state.currentTask);

/**
 * Setup the command bar.
 */
const commandBarOpen = ref(false);

const settingsOpened = ref(false);

const keymap = {
  "ctrl+shift+o": () => (commandBarOpen.value = !commandBarOpen.value),
  "ctrl+shift+s": () => (settingsOpened.value = !settingsOpened.value),
};

const secondsLeftInSeconds = ref(0);
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
    <CommandBar />
    <Teleport to="#modals">
      <!-- <EditTask
        v-if="current.task"
        v-model="current.task"
        :open="sidePanel === 'editTask'"
        @close="sidePanel = ''"
        @save="sidePanel = ''"
      /> -->
      <!-- <TaskDetails v-if="current.task" v-model="current" /> -->
    </Teleport>
    <CommandBar
      :open="commandBarOpen"
      @close="() => (commandBarOpen = false)"
    />
    <ActiveTaskBar
      :task="currentTask"
      :open="Boolean(currentTask)"
      :elapsedTime="secondsLeftInSeconds"
      :session="state.currentSession"
      :categories="state.categories"
    >
      <button
        v-if="currentTask"
        :disabled="
          !(currentTask !== null && !currentTask.jumped) ||
          !getters.remainingSkips
        "
        @click.prevent="jump"
        type="button"
        :class="
          !(currentTask !== null && !currentTask.jumped) ||
          !getters.remainingSkips
            ? 'opacity-50'
            : ''
        "
        class="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        <ForwardIcon class="h-5 w-5 lg:mr-2 lg:-ml-1" aria-hidden="true" />
        <span class="hidden lg:block">
          {{
            !(currentTask !== null && !currentTask.jumped)
              ? "Already Skipped"
              : getters.remainingSkips
              ? "Skip"
              : "No skips left"
          }}
        </span>
      </button>
      <a
        v-if="currentTask && !state.currentSession"
        @click.prevent="() => commit('startSession', currentTask)"
        class="group flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50"
        href="#"
      >
        <PlayIcon class="h-5 w-5 lg:mr-2 lg:-ml-1" aria-hidden="true" />
        <span class="hidden transition duration-200 ease-out lg:block"
          >Start</span
        >
      </a>
      <a
        v-if="currentTask && state.currentSession"
        @click.prevent="completeTaskAndPickNext"
        class="group flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50"
        href="#"
      >
        <CheckCircleIcon class="h-5 w-5 lg:mr-2 lg:-ml-1" aria-hidden="true" />
        <span class="hidden transition duration-200 ease-out lg:block"
          >I'm done</span
        >
      </a>

      <button
        v-if="!currentTask"
        class="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50"
        @click="() => pickATask()"
      >
        <BoltIcon class="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
        <span class="">Pick Task</span>
      </button>
    </ActiveTaskBar>

    <Settings
      :open="settingsOpened"
      :categories="state.categories"
      @update:categories="(categories) => (state.categories = categories)"
      @close="() => (settingsOpened = false)"
      v-model="state.settings"
    ></Settings>
  </div>
</template>
