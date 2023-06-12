<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from "vue";
import { doAction } from "@wordpress/hooks";
import imgBgUrl from "@/assets/groups-bg.png";
import LZString from "lz-string";
import { VueDraggableNext } from "vue-draggable-next";
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
import {
  CheckIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  Bars4Icon,
} from "@heroicons/vue/24/outline";
import { PlusIcon as PlusIconMini } from "@heroicons/vue/20/solid";
import initHooks from "../defaultHooks";
import { defaultSettings } from "../data/defaultSettings";
import { useStore } from "vuex";
import keymaps from "../keymaps";
import { getView } from "@/app";
import GroupMenu from "./GroupMenu.vue";
import EditableText from "./EditableText.vue";

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

const isGroupHovered = (group) => {
  return data.value.hoveredGroup == group.id;
};

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

const blockGroups = computed(() => {
  const filter = getView(data.value.currentView).filter;

  return data.value.groups.filter(filter);
});

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

const isGroupOpened = (group) => {
  return openedGroups.value[group.name] ?? false;
};

const toggleGroup = (group, value?: boolean) => {
  const isOpened = isGroupOpened(group);
  openedGroups.value[group.name] = value ?? !isOpened;
};

const tagGroupAsCurrent = debounce((group) => {
  group.id = group.id?.length
    ? group.id
    : LZString.compressToEncodedURIComponent(group.name);
  data.value.hoveredGroup = group.id;
}, 100);

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

  if (taskIndex >= 0) {
    // focus next task
    group.tasks[target].splice(taskIndex, 1);
    if (taskIndex === 0) {
      focusLastTask(group, group.tasks[target][taskIndex] ?? { id: "not" });
    } else {
      focusLastTask(group, group.tasks[target][taskIndex - 1] ?? { id: "not" });
    }
  }
};
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

      <VueDraggableNext
        ghost-class="group-ghost"
        handle=".group-move-handle"
        group="groups"
        class="divide-y divide-gray-200 sm:grid md:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="(group, groupIndex) in data.groups"
          @mouseover="() => tagGroupAsCurrent(group)"
          :key="group.id"
          :class="[
            'border-gray-200',
            'bg-white',
            'relative group p-8 flex flex-col',
          ]"
        >
          <div class="mt-0 relative">
            <div class="flex items-center justify-between">
              <button
                @click.prevent="() => {}"
                v-tooltip="'Drag to reorder groups'"
                class="absolute top-0 -left-10 scale-x-50 hover:-left-9 hover:scale-x-100 group-move-handle items-center rounded-full bg-transparent text-gray-300 transition-all hover:text-gray-600 focus:outline-none hover:scale-105 text-center"
              >
                <Bars4Icon class="h-7 w-7" />
              </button>
              <div class="mb-2">
                <EditableText
                  @input="
                    ($event) => {
                      group.name = $event.target.value.replace('->', '→');
                    }
                  "
                  :value="group.name"
                  class="bg-transparent text-lg font-medium text-gray-900 focus:outline-none"
                  :id="`group-name-${group.id}`"
                  :placeholder="'Group ' + (groupIndex + 1)"
                />
              </div>
              <div class="-mr-4 -mt-2 flex items-center">
                <div
                  v-if="isGroupHovered(group)"
                  class="p-2"
                  v-tooltip="'This group is currently selected'"
                >
                  <CheckIcon class="h-5 w-5 text-indigo-700" />
                </div>

                <GroupMenu :group="group" />
              </div>
            </div>
            <p
              class="word-wrap mt-1 text-sm text-gray-500 focus:outline-none"
              @input="
                (e) => {
                  group.description = e.target.innerText;
                }
              "
              contenteditable="true"
              placeholder="teste"
            >
              {{ group.description ?? "No description" }}
            </p>
          </div>

          <div class="mt-6 mb-4" v-auto-animate>
            <div
              class="relative z-10 -mr-8 ml-[-28px] mb-[-11px]"
              v-if="isGroupOpened(group)"
            >
              <div
                class="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div class="w-full border-t border-gray-200" />
              </div>
              <div class="relative flex items-center justify-center">
                <span
                  :class="group.ignore ? 'bg-gray-50' : 'bg-white'"
                  class="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-400"
                  >Active</span
                >
              </div>
            </div>
            <!-- Open Tasks -->
            <TaskList
              v-model="group.tasks.active"
              :display-empty-block="true"
              :group="group"
              :active-task="selectedTask"
              :selected-tasks="selectedTasks"
              :categories="data.categories"
              :max-tasks="data.settings.maxTasksPerGroup"
              :class="['-mx-8', group.ignore ? 'bg-gray-50' : 'bg-white']"
              :item-classes="group.ignore ? 'bg-gray-50' : 'bg-white'"
              scope="tasks"
              :picked-task="currentTask"
              @task:done="
                (task, group) => doAction('task.completed', task, group)
              "
              @task:mouseover="
                (task, group) =>
                  (data.hoveredTask = { groupId: group.id, taskId: task.id })
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
            <!-- 
            <div
              v-if="isGroupOpened(group)"
              class="-mx-8 border-l-4 border-l-gray-800"
            >
              <div class="border-t border-gray-200"></div>
            </div> -->

            <div
              class="relative z-10 my-[-11px] -mr-8 ml-[-28px]"
              v-if="isGroupOpened(group)"
            >
              <div
                class="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div class="w-full border-t border-gray-200" />
              </div>
              <div class="relative flex items-center justify-center">
                <span
                  :class="group.ignore ? 'bg-gray-50' : 'bg-white'"
                  class="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-400"
                  >Backlog</span
                >
              </div>
            </div>

            <!-- Backlog Tasks -->
            <TaskList
              v-if="isGroupOpened(group)"
              v-model="group.tasks.backlog"
              :group="group"
              :selected-tasks="selectedTasks"
              :categories="data.categories"
              class="-mx-8"
              :class="[group.ignore ? 'bg-white' : 'bg-gray-50']"
              :item-classes="group.ignore ? 'bg-white' : 'bg-gray-50'"
              :picked-task="currentTask"
              @task:picked="(task, group) => pickTask(task)"
              @update:last-category="
                (category) => (data.lastCategory = snakeCase(category.name))
              "
              scope="tasks"
              @task:mouseover="
                (task, group) =>
                  (data.hoveredTask = { groupId: group.id, taskId: task.id })
              "
              @task:delete="(task, group) => deleteTask(group, task)"
              @task:create="
                (group, position) => {
                  addTask(group, position);
                }
              "
            />
            <!-- End Backlog Tasks -->
            <div
              v-if="isGroupOpened(group)"
              class="-mx-8 border-l-4 border-l-gray-300"
            >
              <div class="border-t border-gray-200"></div>
            </div>
          </div>

          <div
            class="align-self mt-auto -mb-4 -mr-5 -ml-3 flex items-center justify-between"
          >
            <div v-if="group.tasks?.backlog?.length" class="">
              <a
                href="#"
                class="flex justify-items-center text-xs text-gray-400"
                @click.prevent="
                  () => {
                    toggleGroup(group);
                  }
                "
              >
                <component
                  :is="
                    isGroupOpened(group)
                      ? ArrowUpCircleIcon
                      : ArrowDownCircleIcon
                  "
                  class="mr-1 h-4 w-4"
                  aria-hidden="true"
                />
                <span
                  v-text="isGroupOpened(group) ? 'Hide backlog' : 'See backlog'"
                ></span>
              </a>
            </div>
            <div v-else>&nbsp;</div>

            <div class="flex justify-end">
              <button
                type="button"
                v-tooltip.left="'Add new task'"
                class="inline-flex items-center rounded-full border border-transparent bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                @click.prevent="() => addTask(group)"
              >
                <PlusIconMini class="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </VueDraggableNext>
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
