<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from "vue";
import { doAction } from "@wordpress/hooks";
import imgBgUrl from "@/assets/groups-bg.png";
import LZString from "lz-string";
import {
  capitalize,
  snakeCase,
  defaultsDeep,
  debounce,
  findIndex,
} from "lodash";
import moment from "moment/min/moment-with-locales";
import TaskList from "./TaskList.vue";
import Task from "../models/Task";
import initHooks from "../defaultHooks";
import { defaultSettings } from "../data/defaultSettings";
import { useStore } from "vuex";
import keymaps from "../keymaps";

const store = useStore();
const data = computed(() => store.state);
const keymap = keymaps();

const openedGroups = ref({});

const sidePanel = ref("");

const selectedTasks = ref([]);

initHooks();

const loading = ref(true);

const currentUrl = ref("");

const current = ref({
  task: null,
});

const focusLastTask = (group, task) => {
  data.value.currentView = "groups";
  nextTick(() => {
    const taskInput = getTaskTitleInput(group, task);

    nextTick(() => {
      taskInput?.scrollTo();
      taskInput?.focus();
    });
  });
};

const currentTask = ref(null);

const getTaskTitleInput = (group, task) => {
  return document.getElementById(`task-name-${group.id}-${task.id}`);
};

window.addEventListener(
  "hashchange",
  () => {
    extractStateFromUrl();
  },
  false
);

const pickTask = (task) => {
  store.commit("setCurrentTask", task);
  currentTask.value = task;
};

const pickATask = () => {
  const randomGroupIndex = Math.floor(Math.random() * data.value.groups.length);

  const pickedGroup = data.value.groups[randomGroupIndex];

  if (pickedGroup.ignore) {
    return pickATask();
  }

  const randomTaskIndex = Math.floor(
    Math.random() * pickedGroup.tasks.active.length
  );

  const pickedTask = pickedGroup.tasks.active[randomTaskIndex];

  if (pickedTask.done || pickedTask.canceled) {
    return pickATask();
  }

  pickTask(pickedTask, randomTaskIndex, randomGroupIndex);
};

const extractStateFromUrl = () => {
  if (window.location.hash.length <= 1) {
    return;
  }

  console.log("Fetching from the URL...");

  currentUrl.value = window.location.toString();

  const state = JSON.parse(
    LZString.decompressFromEncodedURIComponent(window.location.hash.slice(1))
  );

  state.settings = defaultsDeep(state.settings, defaultSettings);

  return state;
};

const selectedTask = computed(() => {
  return data.value.history.slice(-1)[0];
});

const today = computed(() => {
  return capitalize(
    moment().locale(data.value.settings.lang).format("dddd, LL")
  );
});

onMounted(() => {
  if (!data.value.pageTitle) {
    data.value.pageTitle = today.value;
  }

  data.value.groups.map((group) => {
    group.tasks.finished = [];
    group.tasks.backlog = group.tasks.backlog ?? [];
  });

  if (!currentTask.value && data.value.currentSession?.task) {
    currentTask.value = data.value.currentSession.task;
  }

  nextTick(() => (loading.value = false));
});

const addTask = (group, position = "before", task?: Task) => {
  toggleGroup(group, true);
  task = task ?? new Task("", "", data.value.lastCategory);
  if (!group.tasks?.backlog) {
    group.tasks.backlog = [];
  }
  console.log("pos", position);
  if (position === "before") {
    group.tasks.backlog.unshift(task);
  } else {
    group.tasks.backlog.push(task);
  }

  focusLastTask(group, task);
};

const deleteTask = (group, task) => {
  let target = "active";
  let taskIndex = findIndex(group.tasks.active, ["id", task.id]);

  if (taskIndex < 0) {
    target = "backlog";
    taskIndex = findIndex(group.tasks.backlog, ["id", task.id]);
  }
};
const topTaskInbox = computed(() => {
  return data.value.inbox.tasks[0];
});

const topTaskInboxArray = computed(() => {
  return [data.value.inbox.tasks[0]];
});
</script>

<template>
  <div v-hotkey="keymap" class="container mx-auto pb-40">
    <div
      v-auto-animate
      class="relative rounded-lg border border-gray-200 bg-gray-50 shadow"
    >
      <div
        class="absolute inset-0 bg-no-repeat opacity-10"
        :style="`background-image: url(${imgBgUrl}); background-size: 600px; background-position: right 105%; z-index: 0; -webkit-filter: grayscale(100%); filter: grayscale(100%);`"
      >
        &nbsp;
      </div>

      <div
        group="groups"
        class="divide-y divide-gray-200 sm:grid md:grid-cols-2 lg:grid-cols-3"
      >
        <!-- Title block -->
        <div class="bg-white flex items-center p-8">
          <div class="mt-0 relative">
            <div class="flex items-center justify-between">
              <div class="mb-2">
                <span
                  class="bg-transparent text-lg font-medium text-gray-900 focus:outline-none"
                >
                  {{ data.inbox.name }}
                </span>
              </div>
            </div>
            <p class="word-wrap mt-1 text-sm text-gray-500 focus:outline-none">
              {{ data.inbox.description }}
            </p>
          </div>
        </div>
        <!-- End title block -->
        <div
          :class="[
            'border-gray-200',
            'bg-white',
            'relative group px-8 flex flex-col',
          ]"
        >
          <div v-auto-animate>
            <!-- Open Tasks -->
            <TaskList
              :model-value="topTaskInboxArray"
              :display-empty-block="true"
              :group="{}"
              :active-task="topTaskInbox"
              :selected-tasks="selectedTasks"
              :categories="data.categories"
              :max-tasks="10"
              :class="['-mx-8', 'bg-white']"
              :item-classes="['bg-white']"
              scope="inbox"
              :picked-task="topTaskInbox"
              @task:done="
                (task, group) => doAction('task.completed', task, group)
              "
              @task:picked="(task, group) => pickTask(task)"
              @update:last-category="
                (category) => (data.lastCategory = snakeCase(category.name))
              "
              @task:delete="(task, group) => deleteTask(group, task)"
              @task:dblclick="
                (task) => {
                  current.task = task;
                  sidePanel = 'editTask';
                }
              "
              @task:create="
                (group, position) => {
                  addTask(group, position);
                }
              "
              @list:overflow="
                (tasks) => {
                  group.tasks.backlog = group.tasks.backlog ?? [];
                  group.tasks.backlog.unshift(...tasks);
                }
              "
            />
            <!-- End Open Tasks -->
          </div>
          <div v-auto-animate>
            <!-- Open Tasks -->
            <TaskList
              :model-value="data.inbox.tasks"
              :display-empty-block="true"
              :group="{}"
              :active-task="selectedTask"
              :selected-tasks="selectedTasks"
              :categories="data.categories"
              :max-tasks="10"
              :class="['-mx-8', 'bg-white']"
              :item-classes="['bg-white']"
              scope="inbox"
              :picked-task="currentTask"
              @task:done="
                (task, group) => doAction('task.completed', task, group)
              "
              @task:picked="(task, group) => pickTask(task)"
              @update:last-category="
                (category) => (data.lastCategory = snakeCase(category.name))
              "
              @task:delete="(task, group) => deleteTask(group, task)"
              @task:dblclick="
                (task) => {
                  current.task = task;
                  sidePanel = 'editTask';
                }
              "
              @task:create="
                (group, position) => {
                  addTask(group, position);
                }
              "
              @list:overflow="
                (tasks) => {
                  group.tasks.backlog = group.tasks.backlog ?? [];
                  group.tasks.backlog.unshift(...tasks);
                }
              "
            />
            <!-- End Open Tasks -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pretty.p-icon .state .icon {
  border-width: 2px !important;
}
.ghost,
.group-ghost {
  @apply relative bg-gray-50 transition-all overflow-hidden;
}

.ghost::after {
  @apply absolute bg-gray-50 inset-y-2 inset-x-4 flex items-center justify-center border-2 border-gray-200 border-dashed;
  content: " ";
}

.group-ghost::before {
  @apply absolute bg-gray-50 inset-0 flex items-center justify-center z-10;
  content: " ";
}
.group-ghost::after {
  @apply absolute bg-gray-50 inset-4 flex items-center justify-center border-2 rounded-md border-gray-200 border-dashed z-10;
  content: " ";
}

.grayscale {
  -webkit-filter: grayscale(80%); /* Safari 6.0 - 9.0 */
  filter: grayscale(80%);
}
</style>
