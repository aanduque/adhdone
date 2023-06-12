<script setup lang="ts">
import { onMounted, onUpdated, ref, computed, nextTick, watch } from "vue";
import { applyFilters, doAction } from "@wordpress/hooks";
import imgBgUrl from "@/assets/groups-bg.png";
import download from "in-browser-download";
import QRCodeVue3 from "qrcode-vue3";
import LZString from "lz-string";
import GenerateId from "generate-id";
import { VueDraggableNext } from "vue-draggable-next";
import { markdown } from "markdown";
import {
  flatten,
  capitalize,
  snakeCase,
  defaultsDeep,
  find,
  debounce,
  last,
  findIndex,
  uniq,
  filter,
  values,
  clone,
} from "lodash";
import moment from "moment/min/moment-with-locales";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import {
  Switch,
  SwitchDescription,
  SwitchGroup,
  SwitchLabel,
} from "@headlessui/vue";
import ActiveTaskBar from "./ActiveTaskBar.vue";
import ProgressBar from "./ProgressBar.vue";
import Settings from "./Settings.vue";
import Calendar from "./Calendar.vue";
import Login from "./Login.vue";
import TaskDetails from "./TaskDetails.vue";
import TaskList from "./TaskList.vue";
import EditTask from "./settings/EditTask.vue";
import Task from "../models/Task";
import Group, { groupAsTask } from "../models/Group";
import Session from "../models/Session";
import {
  PlusCircleIcon,
  PlayIcon,
  ForwardIcon,
  DocumentDuplicateIcon,
  UserPlusIcon,
  BoltIcon,
  CheckCircleIcon,
  CheckIcon,
  Cog8ToothIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  ArrowPathIcon,
  SquaresPlusIcon,
  CalendarIcon,
  EllipsisVerticalIcon,
  BookOpenIcon,
  ChevronUpDownIcon,
  PlayCircleIcon,
  ArrowsPointingOutIcon,
  TagIcon,
  LinkIcon,
  GlobeAltIcon,
} from "@heroicons/vue/24/outline";
import { PlusIcon as PlusIconMini } from "@heroicons/vue/20/solid";
import { TrashIcon } from "@heroicons/vue/24/outline";
import { LinearPlugin } from "@/integrations/Linear";
import { SessionPlugin } from "@/integrations/Session";
import initHooks from "../defaultHooks";
import { read, write } from "../helpers/LocalStorage";
import { defaultSettings } from "../data/defaultSettings";
import { defaultState } from "../data/defaultState";

// shortcuts://run-shortcut?name=[name]&input=[input]

const md = (content) => markdown.toHTML(content);

const openedGroups = ref({});

const focusMode = ref(true);

const sidePanel = ref("");

const sessionEndNotificationCounter = ref(0);

function updateTabTitle(number) {
  // var originalTitle = document.title;
  // document.title = "(" + number + ") " + originalTitle;
  // document.getElementsByTagName("title")[0].innerHTML =
  //   "(" + number + ") " + originalTitle;

  document.getElementById("favicon")?.remove();
  document.getElementById("number-favicon")?.remove();
  document.getElementById("badge-favicon")?.remove();
  var link = document.createElement("link");
  link.type = "image/x-icon";
  link.rel = "shortcut icon";
  link.href = "favicon.ico";
  link.id = "number-favicon";
  document.getElementsByTagName("head")[0].appendChild(link);

  var canvas = document.createElement("canvas");
  var img = document.createElement("img");
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    ctx.fillStyle = "rgb(0, 128, 0)";
    ctx.fillRect(0, 0, 20, 20);
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(number, 10, 15);
    var link = document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.id = "badge-favicon";
    link.href = canvas.toDataURL();
    document.getElementsByTagName("head")[0].appendChild(link);
  };
  img.src = "favicon.ico";
}

const settingsOpened = ref(false);

const openTasks = (group) =>
  filter(
    Object.assign(
      {},
      group.tasks.slice(
        0,
        isGroupOpened(group)
          ? group.tasks.length - 1
          : data.value.settings.maxTasksPerGroup
      )
    ),
    (task) => !(task.done || task.canceled)
  );

const finishedTasks = (group) =>
  group.tasks.filter((task) => task.done || task.canceled).slice(0, 3);

const selectedTasks = ref([]);

const isTaskSelected = (task) => {
  return selectedTasks.value.includes(task.id);
};

const Linear = ref(new LinearPlugin());

// const SessionIntegration = ref(new SessionPlugin());

initHooks();

const pullTasks = (group) => {
  toggleGroup(group, true);
  Linear.value.pullTasks(data.value.settings.linearApiKey).then((tasks) => {
    const existingTaskIds = group.tasks.backlog.map((task) => task.id);
    const tasksToAdd = tasks.filter(
      (task) => !existingTaskIds.includes(task.id)
    );
    group.tasks.backlog = group.tasks.backlog.concat(tasksToAdd);
  });
};

const loading = ref(true);

const exportFileName = moment().format("YYYY-MM-DD");

const sidePanelOpen = ref(false);

const hash = computed(() => window.location.hash);

const currentUrl = ref("");

const isDragging = ref(null);

const tabs = [
  { id: "groups", name: "Group View", icon: SquaresPlusIcon, component: null },
  { id: "blocks", name: "Block View", icon: SquaresPlusIcon, component: null },
  // { id: "calendar", name: "Calendar View", icon: CalendarIcon },
  // { id: "notes", name: "Notes View", icon: BookOpenIcon },
];

const colors = [
  "#1abc9c",
  "#3498db",
  "#9b59b6",
  "#34495e",
  "#f1c40f",
  "#e67e22",
  "#e74c3c",
  "#95a5a6",
  "#8e44ad",
  "#2c3e50",
  "#2980b9",
  "#27ae60",
  "#16a085",
  "#f39c12",
];

const getNotesForObject = (objectType, object) => {
  return find(data.value.values.notes, [
    ["ownerType", objectType],
    ["ownerId", object.id],
  ]);
};

const data = ref(defaultState);

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

const focusGroup = () => {
  data.value.currentView = "groups";
  nextTick(() => {
    const lastGroup = last(data.value.groups) as Group;
    const groupName = document.getElementById(`group-name-${lastGroup.id}`);
    nextTick(() => {
      groupName?.scrollTo();
      groupName?.focus();
    });
  });
};

const currentTask = ref(null);

const totalTasks = computed(() => {
  return flatten(
    data.value.groups
      .filter((group) => !group.ignore)
      .map((group) => group.tasks.active)
  ).filter((task) => !task.canceled).length;
});

const completedTasks = computed(() => {
  return flatten(
    data.value.groups
      .filter((group) => !group.ignore)
      .map((group) => group.tasks.active)
  ).filter((task) => task.done).length;
});

const blockGroups = computed(() => {
  return data.value.groups.filter(
    // (group) => data.value.activeBlock?.groups.includes(group.id) ?? true
    (group) => true
  );
});

const skipped = computed(() => {
  return flatten(
    data.value.groups
      .filter((group) => !group.ignore)
      .map((group) => group.tasks.active)
  ).filter((task) => task.jumped).length;
});

const remainingSkips = computed(() => {
  return (
    (data.value.settings.maxSkips ?? 3) -
    flatten(
      data.value.groups
        .filter((group) => !group.ignore)
        .map((group) => group.tasks.active)
    ).filter((task) => task.jumped).length
  );
});

const clearState = () => {
  const state = Object.assign({}, data.value, {
    history: [],
    pageTitle: today.value,
  });

  state.groups = state.groups.map((group) => {
    group.tasks.active = group.tasks.active
      .filter((task) => !((task.done || task.canceled) && !task.recurring))
      .map((task) => {
        task.jumped = false;
        if (task?.recurring) {
          task.done = false;
        }

        return task;
      });
    group.tasks.backlog = group.tasks.backlog
      .filter((task) => !((task.done || task.canceled) && !task.recurring))
      .map((task) => {
        task.jumped = false;
        if (task?.recurring) {
          task.done = false;
        }

        return task;
      });
    return group;
  });

  return state;
};

const updateUrlWithState = () => {
  return;

  const compressedValue = LZString.compressToEncodedURIComponent(
    JSON.stringify(data.value)
  );

  const url = new URL(window.location.toString());

  url.hash = compressedValue;

  window.history.pushState({}, "", url);
};

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

const secondsLeftInSeconds = ref(0);

const endCurrentSession = () => {
  data.value.currentSession.endedAt = Date.now();
  data.value.sessions = data.value.sessions ?? [];
  data.value.sessions.push(data.value.currentSession);
  data.value.currentSession = null;
};

const start = (task) => {
  console.log(`Starting task "${task.title}"`);
  data.value.currentSession = new Session(task);
  doAction("task.start", task, data.value.settings);
};

const pickTask = (task) => {
  task.counter++;

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

const pickTaskInGroup = (group) => {
  const randomTaskIndex = Math.floor(Math.random() * group.tasks.active.length);

  const pickedTask = group.tasks.active[randomTaskIndex];

  if (pickedTask.done || pickedTask.canceled) {
    return pickATask();
  }

  pickTask(pickedTask, randomTaskIndex, 0);
};

const initializeState = () => {
  const state = defaultsDeep(read("state", extractStateFromUrl), data.value);

  state.settings = defaultsDeep(state.settings, defaultSettings);

  data.value = state;
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

const jump = () => {
  if (currentTask.value === null) {
    return;
  }
  currentTask.value.jumped = true;

  pickATask();
};

const completeTaskAndPickNext = () => {
  endCurrentSession();
  pickATask();
  doAction("task.next", data.value.settings);
};

const today = computed(() => {
  return capitalize(
    moment().locale(data.value.settings.lang).format("dddd, LL")
  );
});

const isActive = (task) => {
  return currentTask.value && currentTask.value.id === task.id;
};

const c = console;

const isGroupOpened = (group) => {
  return openedGroups.value[group.name] ?? false;
};

const toggleGroup = (group, value?: boolean) => {
  const isOpened = isGroupOpened(group);
  openedGroups.value[group.name] = value ?? !isOpened;
};

const taskHasCategory = (task, categoryId) => {
  const category = getCategory(task.category);

  return snakeCase(category.name) === snakeCase(categoryId);
};

const getCategory = (categoryId: string) => {
  const categoriesList = clone(data.value.categories);

  categoriesList.push({
    name: "Group",
    color: "#333333",
  });

  // console.log(categoriesList)

  return (
    categoriesList.filter(
      (category) => snakeCase(category.name) === snakeCase(categoryId)
    )[0] ?? {
      name: "No category",
      color: "#f9f9f9",
    }
  );
};

const tagGroupAsCurrent = debounce((group) => {
  group.id = group.id?.length
    ? group.id
    : LZString.compressToEncodedURIComponent(group.name);
  data.value.hoveredGroup = group.id;
}, 100);

watch(() => data.value.groups, updateUrlWithState, { deep: true });
watch(() => data.value.sessions, updateUrlWithState, { deep: true });
watch(() => data.value.currentSession, updateUrlWithState, { deep: true });

function sendNotification(title, options) {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications.");
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(title, options);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        new Notification(title, options);
      }
    });
  }
}

const getAllTasks = (groups: Group[]) => {
  return flatten(groups.map((group: Group) => flatten(group.tasks ?? [])));
};

onMounted(() => {
  initializeState();

  if (!data.value.pageTitle) {
    data.value.pageTitle = today.value;
  }

  // Set the active block based on the time of the day
  const now = moment();
  const currentBlock = data.value.blocks?.filter((block) => {
    const start = moment(block.start, "HH:mm");
    const end = moment(block.end, "HH:mm");

    return now.isBetween(start, end);
  })[0];

  console.log("active block", currentBlock);

  data.value.activeBlock = currentBlock;

  setInterval(() => {
    if (data.value.currentSession) {
      const now = Date.now();
      const millisecondsLeft =
        data.value.currentSession.startedAt +
        data.value.settings.pomodoroLength * 60 * 1000 -
        now;
      secondsLeftInSeconds.value =
        millisecondsLeft >= 0
          ? Math.round(millisecondsLeft / 1000)
          : Math.round((now - data.value.currentSession.startedAt) / 1000);

      updateTabTitle(Math.round(secondsLeftInSeconds.value / 60));
    }
  }, 1000);

  console.log(data.value.sessions);

  data.value.groups.map((group) => {
    group.tasks.finished = [];
    group.tasks.backlog = group.tasks.backlog ?? [];
  });

  console.log(data.value.currentSession);

  if (!currentTask.value && data.value.currentSession?.task) {
    currentTask.value = data.value.currentSession.task;
  }

  nextTick(() => (loading.value = false));
});

onUpdated(() => {
  console.log("Updating... Check if sync is needed...");

  const syncFrequencyInMinutes = 0.1;
  const lastSync = data.value.lastSync ?? 0;

  if (lastSync + syncFrequencyInMinutes * 1000 * 60 <= Date.now()) {
    console.log("Starting Sync to LocalStorage...");

    nextTick(() => {
      write("state", data.value);

      const newSyncTimestamp = Date.now();

      console.log(`Sync finished. New lastSync value: ${newSyncTimestamp}`);

      data.value.lastSync = newSyncTimestamp;
    });
  }
});

const getGroupBy = (value, field = "id") => {
  return find(data.value.groups, [field, value]);
};

const getGroupTasks = (group) => {
  return flatten(values(group.tasks));
};

const getTaskBy = (groupId, value, field = "id") => {
  const group = getGroupBy(groupId) ?? { tasks: { active: [] } };
  const tasks = getGroupTasks(group);
  return find(tasks, [field, value]);
};

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

const addGroup = () => {
  data.value.groups.push(new Group(`Group ${data.value.groups.length + 1}`));

  focusGroup();
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

const deleteGroup = (group) => {
  const groupIndex = findIndex(data.value.groups, ["id", group.id]);
  data.value.groups.splice(groupIndex, 1);
};

const keymap = {
  // 'esc+ctrl' is OK.
  "shift+esc": (event) => {
    openedGroups.value = {};
  },
  x: (event) => {
    if (selectedTasks.value.includes(data.value.hoveredTask.taskId)) {
      const index = findIndex(
        selectedTasks.value,
        data.value.hoveredTask.taskId
      );
      selectedTasks.value.splice(index, 1);
    } else {
      selectedTasks.value.push(data.value.hoveredTask.taskId);
    }
    selectedTasks.value = uniq(selectedTasks.value);
    console.log(selectedTasks.value);
  },
  "shift+d": (event) => {
    if (data.value.hoveredTask.taskId) {
      const task = getTaskBy(
        data.value.hoveredTask.groupId,
        data.value.hoveredTask.taskId
      );
      task && (task.done = !task.done);
    }
  },
  "shift+i": (event) => {
    if (data.value.hoveredGroup) {
      const group = getGroupBy(data.value.hoveredGroup);
      group.ignore = !group.ignore;
    }
  },
  "shift+c": (event) => {
    if (data.value.hoveredTask.taskId) {
      const task = getTaskBy(
        data.value.hoveredTask.groupId,
        data.value.hoveredTask.taskId
      );
      task && (task.canceled = !task.canceled);
    }
  },
  "shift+p": (event) => {
    if (data.value.hoveredTask.taskId) {
      const task = getTaskBy(
        data.value.hoveredTask.groupId,
        data.value.hoveredTask.taskId
      );
      task && pickTask(task);
    }
  },
  o: (event) => {
    if (data.value.hoveredGroup) {
      const group = getGroupBy(data.value.hoveredGroup);
      toggleGroup(group);
    }
  },
  "shift+o": (event) => {
    for (const group of data.value.groups) {
      setTimeout(() => {
        toggleGroup(group);
      }, 0);
    }
  },
  c: (event) => {
    if (data.value.hoveredGroup) {
      const group = getGroupBy(data.value.hoveredGroup);

      if (group) {
        addTask(group);
      }
    }
  },
};
</script>

<template>
  <div class="min-h-full bg-gray-100 pb-24" v-hotkey="keymap" v-if="true">
    <ProgressBar :completed="completedTasks" :total="totalTasks" />
    <header class="bg-white shadow-sm print:hidden">
      <div class="container mx-auto p-4 sm:px-6 lg:px-8">
        <div class="items-center md:flex md:justify-between">
          <div class="flex min-w-0 flex-1 items-center">
            <!-- <h2
                class="
                  text-2xl
                  font-bold
                  leading-7
                  text-gray-900
                  sm:truncate sm:text-2xl sm:tracking-tight
                "
              >
                Back End Developer
              </h2> -->
            <input
              class="w-full text-lg font-medium leading-7 text-gray-900 focus:outline-none sm:truncate sm:text-xl sm:tracking-tight lg:text-2xl"
              :size="data.pageTitle.length ? data.pageTitle.length - 4 : 20"
              :placeholder="today"
              v-model="data.pageTitle"
            />
          </div>
          <div class="mt-4 flex items-center md:mt-0 md:ml-4">
            <button
              type="button"
              class="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 lg:ml-3 lg:w-auto"
              @click.prevent="() => addGroup()"
            >
              <PlayCircleIcon
                class="mr-2 h-6 w-6 text-white"
                aria-hidden="true"
              />
              Add Group
            </button>
            <Menu as="div" class="relative ml-2 inline-block text-left">
              <div>
                <MenuButton
                  class="flex items-center rounded-full text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                >
                  <span class="sr-only">Open options</span>
                  <EllipsisVerticalIcon class="h-6 w-6" aria-hidden="true" />
                </MenuButton>
              </div>

              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-0 z-20 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <a
                        href="#"
                        @click.prevent="
                          () => {
                            data = clearState();
                          }
                        "
                        :class="[
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'group flex items-center px-4 py-2 text-sm',
                        ]"
                      >
                        <DocumentDuplicateIcon
                          class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        Duplicate
                      </a>
                    </MenuItem>
                  </div>
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <a
                        href="#"
                        @click.prevent="() => (settingsOpened = true)"
                        :class="[
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'group flex items-center px-4 py-2 text-sm',
                        ]"
                      >
                        <Cog8ToothIcon
                          class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        Settings
                      </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <a
                        href="#"
                        :class="[
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'group flex items-center px-4 py-2 text-sm',
                        ]"
                      >
                        <TagIcon
                          class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        Categories
                      </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <a
                        href="#"
                        :class="[
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'group flex items-center px-4 py-2 text-sm',
                        ]"
                      >
                        <LinkIcon
                          class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        Integrations
                      </a>
                    </MenuItem>
                  </div>
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <a
                        href="#"
                        :class="[
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'group flex items-center px-4 py-2 text-sm',
                        ]"
                      >
                        <UserPlusIcon
                          class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        Share
                      </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <a
                        href="#"
                        @click.prevent="
                          () => {
                            const jsonToDownload = Object.assign({}, data, {
                              hash,
                            });
                            download(
                              JSON.stringify(jsonToDownload),
                              `${exportFileName}.tasks.json`
                            );
                          }
                        "
                        :class="[
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'group flex items-center px-4 py-2 text-sm',
                        ]"
                      >
                        <ArrowDownCircleIcon
                          class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        Export
                      </a>
                    </MenuItem>
                  </div>
                  <div class="py-1">
                    <MenuItem v-slot="{ active }">
                      <a
                        href="#"
                        :class="[
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'group flex items-center px-4 py-2 text-sm',
                        ]"
                      >
                        <CheckCircleIcon
                          class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        Remove Finished
                      </a>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                      <a
                        href="#"
                        :class="[
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'group flex items-center px-4 py-2 text-sm',
                        ]"
                      >
                        <TrashIcon
                          class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                        Clear All
                      </a>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>

    <div class="container mx-auto min-h-full" v-auto-animate>
      <div class="py-6">
        <div class="sm:hidden">
          <label for="tabs" class="sr-only">Select a tab</label>
          <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
          <select
            id="tabs"
            name="tabs"
            class="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option
              v-for="tab in tabs"
              :key="tab.name"
              :selected="(data.currentView ?? 'groups') === tab.id"
            >
              {{ tab.name }}
            </option>
          </select>
        </div>
        <div class="hidden sm:block">
          <nav class="flex justify-center space-x-4" aria-label="Tabs">
            <a
              v-for="tab in tabs"
              href="#"
              :key="tab.name"
              @click.prevent="() => (data.currentView = tab.id)"
              :class="[
                (data.currentView ?? 'groups') === tab.id
                  ? 'bg-gray-200 text-gray-800'
                  : 'text-gray-600 hover:text-gray-800',
                'flex items-center px-3 py-2 font-medium text-sm rounded-md group',
              ]"
              :aria-current="
                (data.currentView ?? 'groups') === tab.id ? 'page' : undefined
              "
            >
              <component :is="tab.icon" class="h-4 w-4" />
              <span
                :class="(data.currentView ?? 'groups') === tab.id ? '' : ''"
                class="ml-2"
                >{{ tab.name }}</span
              >
            </a>
          </nav>
        </div>
      </div>

      <!-- Block View -->
      <div
        v-if="data.currentView === 'blocks'"
        class="relative divide-y divide-gray-200 rounded-lg bg-white bg-no-repeat shadow sm:grid sm:gap-px sm:divide-y-0 md:grid-cols-2 lg:grid-cols-3"
      >
        hello
      </div>
      <!-- / Block View -->

      <!-- Calendar View-->
      <div
        v-if="data.currentView === 'calendar'"
        class="relative divide-y divide-gray-200 rounded-lg bg-white bg-no-repeat shadow sm:grid sm:gap-px sm:divide-y-0 md:grid-cols-2 lg:grid-cols-3"
      >
        <Calendar :sessions="data.sessions ?? []" :groups="data.groups" />
      </div>
      <!-- / Calendar View -->

      <!-- Group View-->
      <div
        v-if="data.currentView === 'groups'"
        v-auto-animate
        class="relative rounded-lg bg-gray-50 bg-no-repeat shadow"
      >
        <div
          class="absolute inset-0 bg-no-repeat opacity-10"
          :style="`background-image: url(${imgBgUrl}); background-size: 600px; background-position: right 105%; z-index: 0; -webkit-filter: grayscale(100%); filter: grayscale(100%);`"
        >
          &nbsp;
        </div>
        <VueDraggableNext
          v-model="blockGroups"
          ghost-class="group-ghost"
          handle=".group-move-handle"
          group="groups"
          class="divide-y divide-gray-200 sm:grid md:grid-cols-2 lg:grid-cols-3"
        >
          <div
            v-for="(group, groupIndex) in blockGroups"
            @mouseover="() => tagGroupAsCurrent(group)"
            :key="group.id"
            :class="[
              'border-r border-gray-200',
              groupIndex === 0
                ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none'
                : '',
              groupIndex === 1 ? 'md:rounded-tr-lg lg:rounded-tr-none' : '',
              groupIndex === 2 ? 'lg:rounded-tr-lg' : '',
              groupIndex === data.groups.length - 3 ? 'lg:rounded-bl-lg' : '',
              groupIndex === data.groups.length - 2
                ? 'md:rounded-bl-lg lg:rounded-bl-none'
                : '',
              groupIndex === data.groups.length - 1
                ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none'
                : '',
              'relative group p-8 flex flex-col',
              group.ignore ? 'bg-gray-50 order-last' : 'bg-white',
            ]"
          >
            <!-- <div>
              <span
                :class="[
                  group.iconBackground,
                  group.iconForeground,
                  'rounded-lg inline-flex p-3 ring-4 ring-white',
                ]"
              >
                <component :is="group.icon" class="h-6 w-6" aria-hidden="true" />
              </span>
            </div> -->
            <div class="mt-0">
              <!-- <h3 class="text-lg font-medium">
                {{ group.name }}
              </h3> -->
              <div class="flex items-center justify-between">
                <input
                  @input="
                    ($event) => {
                      group.name = $event.target.value.replace('->', '→');
                    }
                  "
                  :value="group.name"
                  class="-mt-2 bg-transparent py-2 text-lg font-medium text-gray-900 focus:outline-none"
                  :id="`group-name-${group.id}`"
                  :placeholder="'Group ' + (groupIndex + 1)"
                />
                <div class="-mr-4 -mt-2 flex items-center">
                  <div
                    v-if="isGroupHovered(group)"
                    class="p-2"
                    v-tooltip="'This group is currently selected'"
                  >
                    <CheckIcon class="h-5 w-5 text-indigo-700" />
                  </div>
                  <button
                    @click.prevent="() => pickTask(groupAsTask(group))"
                    v-tooltip="'Run group as task'"
                    class="group-move-handle hidden items-center rounded-full bg-transparent p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 group-hover:flex"
                  >
                    <PlayCircleIcon class="h-5 w-5" />
                  </button>
                  <button
                    v-tooltip="'Pick task within this group'"
                    @click.prevent="() => pickTaskInGroup(group)"
                    class="hidden items-center rounded-full bg-transparent p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 group-hover:flex"
                  >
                    <BoltIcon class="h-5 w-5" />
                  </button>
                  <button
                    v-tooltip="'Pull tasks from integrations'"
                    @click.prevent="() => pullTasks(group)"
                    class="hidden items-center rounded-full bg-transparent p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 group-hover:flex"
                  >
                    <ArrowPathIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click.prevent="() => {}"
                    v-tooltip="'Drag to reorder groups'"
                    class="group-move-handle hidden items-center rounded-full bg-transparent p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 group-hover:flex"
                  >
                    <ArrowsPointingOutIcon class="h-5 w-5" />
                  </button>
                  <Menu as="div" class="relative inline-block text-left">
                    <div>
                      <MenuButton
                        v-tooltip="'Group settings'"
                        class="hidden items-center rounded-full bg-transparent p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 group-hover:flex"
                      >
                        <span class="sr-only">Open options</span>
                        <Cog8ToothIcon class="h-5 w-5" aria-hidden="true" />
                      </MenuButton>
                    </div>

                    <transition
                      enter-active-class="transition ease-out duration-100"
                      enter-from-class="transform opacity-0 scale-95"
                      enter-to-class="transform opacity-100 scale-100"
                      leave-active-class="transition ease-in duration-75"
                      leave-from-class="transform opacity-100 scale-100"
                      leave-to-class="transform opacity-0 scale-95"
                    >
                      <MenuItems
                        class="absolute right-0 z-20 mt-2 w-72 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      >
                        <div class="py-1">
                          <MenuItem v-slot="{ active }">
                            <a
                              href="#"
                              :class="[
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'flex justify-between px-4 py-2 text-sm',
                              ]"
                            >
                              <SwitchGroup
                                as="div"
                                class="flex items-center justify-between"
                              >
                                <span class="flex grow flex-col">
                                  <SwitchLabel
                                    as="span"
                                    class="text-sm font-medium text-gray-900"
                                    passive
                                    >Ignore group</SwitchLabel
                                  >
                                  <SwitchDescription
                                    as="span"
                                    class="text-sm text-gray-500"
                                    >Prevent tasks from this group from being
                                    picked.</SwitchDescription
                                  >
                                </span>
                                <Switch
                                  v-model="group.ignore"
                                  :class="[
                                    group.ignore
                                      ? 'bg-indigo-600'
                                      : 'bg-gray-200',
                                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                                  ]"
                                >
                                  <span
                                    aria-hidden="true"
                                    :class="[
                                      group.ignore
                                        ? 'translate-x-5'
                                        : 'translate-x-0',
                                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                                    ]"
                                  />
                                </Switch>
                              </SwitchGroup>
                            </a>
                          </MenuItem>
                        </div>
                        <div class="py-1">
                          <MenuItem v-slot="{ active }">
                            <a
                              href="#"
                              :class="[
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'flex justify-between px-4 py-2 text-sm',
                              ]"
                            >
                              <SwitchGroup
                                as="div"
                                class="flex items-center justify-between"
                              >
                                <span class="flex grow flex-col">
                                  <SwitchLabel
                                    as="span"
                                    class="text-sm font-medium text-gray-900"
                                    passive
                                    >Block Checlist</SwitchLabel
                                  >
                                  <SwitchDescription
                                    as="span"
                                    class="text-sm text-gray-500"
                                    >Block checklists are a special kind of
                                    group, that needs to be completed before the
                                    other groups are
                                    available.</SwitchDescription
                                  >
                                </span>
                                <Switch
                                  @update:model-value="
                                    () =>
                                      data.activeBlock &&
                                      (data.activeBlock.checklist = group.id)
                                  "
                                  :modelValue="
                                    data.activeBlock?.checklist === group.id
                                  "
                                  :class="[
                                    group.ignore
                                      ? 'bg-indigo-600'
                                      : 'bg-gray-200',
                                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                                  ]"
                                >
                                  <span
                                    aria-hidden="true"
                                    :class="[
                                      group.ignore
                                        ? 'translate-x-5'
                                        : 'translate-x-0',
                                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                                    ]"
                                  />
                                </Switch>
                              </SwitchGroup>
                            </a>
                          </MenuItem>
                        </div>
                        <div class="py-1">
                          <MenuItem v-slot="{ active }">
                            <a
                              @click.prevent="() => deleteGroup(group)"
                              href="#"
                              :class="[
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'group flex items-center px-4 py-2 text-sm',
                              ]"
                            >
                              <TrashIcon
                                class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                              Delete
                            </a>
                          </MenuItem>
                        </div>
                      </MenuItems>
                    </transition>
                  </Menu>
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
                    v-text="
                      isGroupOpened(group) ? 'Hide backlog' : 'See backlog'
                    "
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

    <QRCodeVue3
      v-if="!loading && false"
      :value="currentUrl"
      :download="true"
      :width="500"
      :height="500"
      :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'L' }"
      :imageOptions="{ hideBackgroundDots: true, imageSize: 0.4, margin: 0 }"
      :dotsOptions="{
        type: 'dots',
        color: '#26249a',
        gradient: {
          type: 'linear',
          rotation: 0,
          colorStops: [
            { offset: 0, color: '#26249a' },
            { offset: 1, color: '#26249a' },
          ],
        },
      }"
      :backgroundOptions="{ color: '#ffffff' }"
      :cornersSquareOptions="{ type: 'dot', color: '#000000' }"
      :cornersDotOptions="{ type: undefined, color: '#000000' }"
      fileExt="png"
      myclass="my-qur"
      imgclass="img-qr"
      :downloadOptions="{ name: 'vqr', extension: 'png' }"
    />

    <ActiveTaskBar
      :task="currentTask"
      :open="Boolean(currentTask)"
      :elapsedTime="secondsLeftInSeconds"
      :session="data?.currentSession"
      :fullScreen="focusMode"
      :categories="data.categories"
      @close="focusMode = false"
      @toggle-full-screen="focusMode = true"
      @task:pick="pickATask"
      @task:start="(task) => start(task)"
      @task:complete-and-next="completeTaskAndPickNext"
    >
      <button
        v-if="currentTask"
        :disabled="
          !(currentTask !== null && !currentTask.jumped) || !remainingSkips
        "
        @click.prevent="jump"
        type="button"
        :class="
          !(currentTask !== null && !currentTask.jumped) || !remainingSkips
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
              : remainingSkips
              ? "Skip"
              : "No skips left"
          }}
        </span>
      </button>
      <a
        v-if="currentTask && !data.currentSession"
        @click.prevent="() => start(currentTask)"
        class="group flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm hover:bg-indigo-50"
        href="#"
      >
        <PlayIcon class="h-5 w-5 lg:mr-2 lg:-ml-1" aria-hidden="true" />
        <span class="hidden transition duration-200 ease-out lg:block"
          >Start</span
        >
      </a>
      <a
        v-if="currentTask && data.currentSession"
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

    <Teleport to="#modals">
      <EditTask
        v-if="current.task"
        v-model="current.task"
        :open="sidePanel === 'editTask'"
        @close="sidePanel = ''"
        @save="sidePanel = ''"
      />
      <!-- <TaskDetails v-if="current.task" v-model="current" /> -->
      <!-- <SidePanel title="History" :open="true">
          <div>
            <table>
              <thead>
                <tr>
                  <th>Group</th>
                  <th>Task #</th>
                  <th>Task</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(entry, index) in data.history" :key="index">
                  <td>{{ entry[0] + 1 }}</td>
                  <td>{{ entry[1] + 1 }}</td>
                  <td>{{ entry[2] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </SidePanel> -->
    </Teleport>
    <CommandBar />
    <Settings
      :open="settingsOpened"
      :categories="data.categories"
      @update:categories="(categories) => (data.categories = categories)"
      @close="() => (settingsOpened = false)"
      v-model="data.settings"
    ></Settings>
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
