<script setup lang="ts">
import { onMounted, onUpdated, ref, computed, nextTick, watch } from "vue";
import { applyFilters, doAction } from "@wordpress/hooks";
import imgBgUrl from "@/../public/groups-bg.png";
import download from "in-browser-download";
import QRCodeVue3 from "qrcode-vue3";
import LZString from "lz-string";
import GenerateId from "generate-id";
import {
  flatten,
  template,
  templateSettings,
  capitalize,
  snakeCase,
  defaultsDeep,
  get,
  find,
  debounce,
  last,
  findIndex,
} from "lodash";
import moment from "moment/min/moment-with-locales";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import {
  Switch,
  SwitchDescription,
  SwitchGroup,
  SwitchLabel,
} from "@headlessui/vue";
import { EllipsisVerticalIcon } from "@heroicons/vue/20/solid";
import ActiveTaskBar from "./ActiveTaskBar.vue";
import SidePanel from "./SidePanel.vue";
import Empty from "./Empty.vue";
import ProgressBar from "./ProgressBar.vue";
import Settings from "./Settings.vue";
import Calendar from "./Calendar.vue";
import TaskDetails from "./TaskDetails.vue";
import TaskCheck from "./TaskCheck.vue";
import {
  PlusCircleIcon,
  PlayIcon,
  ForwardIcon,
  PlusIcon,
  BoltIcon,
  CheckCircleIcon,
  CheckIcon,
  EllipsisHorizontalIcon,
  CogIcon,
  Cog8ToothIcon,
  EllipsisHorizontalCircleIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  TagIcon,
  RectangleGroupIcon,
  ClipboardDocumentCheckIcon,
  ArchiveBoxArrowDownIcon,
  ArrowPathIcon,
  SquaresPlusIcon,
  CalendarIcon,
} from "@heroicons/vue/24/outline";
import { PlusIcon as PlusIconMini } from "@heroicons/vue/20/solid";
import { PlusIcon as PlusIconOutline } from "@heroicons/vue/24/outline";
import {
  ArchiveBoxIcon,
  ArrowRightCircleIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  HeartIcon,
  PencilSquareIcon,
  UserPlusIcon,
} from "@heroicons/vue/20/solid";
import {
  AcademicCapIcon,
  BanknotesIcon,
  CheckBadgeIcon,
  ClockIcon,
  ReceiptRefundIcon,
  UsersIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import { getIssues, LinearPlugin } from "@/integrations/Linear";
import { SessionPlugin } from "@/integrations/Session";

const defaultSettings = {
  lang: "pt-br",
  maxGroups: 3,
  maxTasksPerGroup: 5,
  maxRoundsPerTask: 3,
  pomodoroLength: 25,
  maxSkips: 3,
  actionPause: "session:///pause",
  actionComplete: "session:///break",
  actionStart:
    "session:///start?intent={{taskTitle}}&duration={{duration}}&notes={{taskDescription}}&categoryName={{taskCategory}}",
};
const openedGroups = ref({});

const settingsOpened = ref(false);

const selectedTasks = ref([]);

const idGenerator = new GenerateId();

const Linear = ref(new LinearPlugin());
const Session = ref(new SessionPlugin());

const pullTasks = (group) => {
  Linear.pullTasks().then((tasks) => (group.tasks = group.tasks.concat(tasks)));
};

const loading = ref(true);

const exportFileName = moment().format("YYYY-MM-DD");

const sidePanelOpen = ref(false);

const hash = computed(() => window.location.hash);

const currentUrl = ref("");

const tabs = [
  { id: "groups", name: "Group View", icon: SquaresPlusIcon },
  { id: "calendar", name: "Calendar View", icon: CalendarIcon },
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

const data = ref({
  history: [],
  pageTitle: "",
  lastCategory: "",
  categories: [
    {
      name: "General",
      color: "#1abc9c",
    },
    {
      name: "Personal",
      color: "#16a085",
    },
    {
      name: "Development",
      color: "#2980b9",
    },
  ],
  settings: defaultSettings,
  hoveredGroup: null,
  hoveredTask: null,
  currentView: "groups",
  groups: [
    {
      name: "",
      ignore: false,
      tasks: [
        {
          title: "My Task",
          description: "",
          category: "development",
          done: false,
          jumped: false,
          counter: 0,
        },
      ],
    },
    {
      name: "",
      ignore: false,
      tasks: [
        {
          title: "My First Task",
          description: "",
          category: "development",
          done: false,
          jumped: false,
          counter: 0,
        },
      ],
    },
  ],
});

const current = ref({
  task: null,
});

const isGroupHovered = (group) => {
  return data.value.hoveredGroup == group.id;
};

// Api key authentication

const getTaskTitleInput = (group, task) => {
  return document.getElementById(`task-name-${group.id}-${task.id}`);
};

const focusLastTask = (group) => {
  data.value.currentView = "groups";
  nextTick(() => {
    const lastTask = last(group.tasks) as Task;
    const taskInput = getTaskTitleInput(group, lastTask);

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

class Task {
  id = null;

  done = false;

  category = "";

  jumped = false;

  counter = 0;

  title = "My Task";

  description = "";

  constructor(task = "My Task", description = "", category = "") {
    this.title = task;
    this.description = description;
    this.category = category;
    this.id = idGenerator.generate(20);
  }
}

const totalTasks = computed(() => {
  return flatten(
    data.value.groups
      .filter((group) => !group.ignore)
      .map((group) => group.tasks)
  ).length;
});

const completedTasks = computed(() => {
  return flatten(
    data.value.groups
      .filter((group) => !group.ignore)
      .map((group) => group.tasks)
  ).filter((task) => task.done).length;
});

const skipped = computed(() => {
  return flatten(
    data.value.groups
      .filter((group) => !group.ignore)
      .map((group) => group.tasks)
  ).filter((task) => task.jumped).length;
});

const remainingSkips = computed(() => {
  return (
    (data.value.settings.maxSkips ?? 3) -
    flatten(
      data.value.groups
        .filter((group) => !group.ignore)
        .map((group) => group.tasks)
    ).filter((task) => task.jumped).length
  );
});

const clearState = () => {
  const state = Object.assign({}, data.value, {
    history: [],
  });

  state.groups = state.groups.map((group) => {
    group.tasks = group.tasks
      .filter((task) => !task.done)
      .map((task) => {
        task.jumped = false;

        return task;
      });
    return group;
  });

  return state;
};

class Group {
  id: string | null = null;

  name = null;

  ignore = false;

  tasks: Task[] = [];

  constructor() {
    this.id = idGenerator.generate(20);
  }
}

const updateUrlWithState = () => {
  const compressedValue = LZString.compressToEncodedURIComponent(
    JSON.stringify(data.value)
  );

  const url = new URL(window.location.toString());

  url.hash = compressedValue;

  console.log(url);

  window.history.pushState({}, "", url);
};

window.addEventListener(
  "hashchange",
  () => {
    extractStateFromUrl();
  },
  false
);

const start = (task) => {
  console.log(`Starting task "${task.title}"`);
  doAction("task.start", task, data.value.settings);
};

const pickTask = (task, taskIndex, groupIndex) => {
  task.counter++;

  currentTask.value = task;

  data.value.history.push([groupIndex, taskIndex, task.title]);
};

const pickATask = () => {
  const randomGroupIndex = Math.floor(Math.random() * data.value.groups.length);

  const pickedGroup = data.value.groups[randomGroupIndex];

  if (pickedGroup.ignore) {
    return pickATask();
  }

  const randomTaskIndex = Math.floor(Math.random() * pickedGroup.tasks.length);

  const pickedTask = pickedGroup.tasks[randomTaskIndex];

  if (pickedTask.done) {
    return pickATask();
  }

  pickTask(pickedTask, randomTaskIndex, randomGroupIndex);
};

const extractStateFromUrl = () => {
  if (window.location.hash.length <= 1) {
    return;
  }

  // console.log(window.location.hash);

  currentUrl.value = window.location.toString();

  const state = JSON.parse(
    LZString.decompressFromEncodedURIComponent(window.location.hash.slice(1))
  );

  // console.log(state);

  state.settings = defaultsDeep(state.settings, defaultSettings);

  data.value = state;
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
  pickATask();
  doAction("task.next", data.value.settings);
};

const today = computed(() => {
  // console.log(data.value.settings.lang);
  return capitalize(
    moment().locale(data.value.settings.lang).format("dddd, LL")
  );
});

const isActive = (groupIndex, taskIndex) => {
  return (
    currentTask.value &&
    currentTask.value === data.value.groups[groupIndex].tasks[taskIndex]
  );
};

const c = console;

const isGroupOpened = (group) => {
  return openedGroups.value[group.name] ?? false;
};

const toggleGroup = (group) => {
  const isOpened = isGroupOpened(group);
  openedGroups.value[group.name] = !isOpened;
};

const taskHasCategory = (task, categoryId) => {
  const category = getCategory(task.category);

  return snakeCase(category.name) === snakeCase(categoryId);
};

const getCategory = (categoryId: string) => {
  return (
    data.value.categories.filter(
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
  // console.log(group);
  data.value.hoveredGroup = group.id;
}, 100);

const tagTaskAsCurrent = debounce((task) => {
  task.id = task.id
    ? task.id
    : LZString.compressToEncodedURIComponent(task.title);
  // console.log(task);
  data.value.hoveredTask = task.id;
}, 100);

watch(() => data.value.groups, updateUrlWithState, { deep: true });

// onUpdated(updateUrlWithState);

onMounted(() => {
  // console.log("Loaded");

  extractStateFromUrl();

  if (selectedTask.value) {
    currentTask.value =
      data.value.groups[selectedTask.value[0]].tasks[selectedTask.value[1]];
  }

  nextTick(() => (loading.value = false));
});

const getGroupBy = (value, field = "id") => {
  return find(data.value.groups, [field, value]);
};

const addTask = (group, task?: Task) => {
  group.tasks.push(task ?? new Task("", "", data.value.lastCategory));

  focusLastTask(group);
};

const addGroup = () => {
  data.value.groups.push(new Group());

  focusGroup();
};

const deleteTask = (group, task) => {
  const taskIndex = findIndex(group.tasks, ["id", task.id]);
  group.tasks.splice(taskIndex, 1);
};

const deleteGroup = (group) => {
  const groupIndex = findIndex(data.value.groups, ["id", group.id]);
  data.value.groups.splice(groupIndex, 1);
};

const keymap = {
  // 'esc+ctrl' is OK.
  x: (event) => {
    console.log(data.value.hoveredTask);
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
  <div class="bg-gray-100 pb-24" v-hotkey="keymap">
    <ProgressBar :completed="completedTasks" :total="totalTasks" />
    <header class="bg-white shadow-sm print:hidden">
      <div class="mx-auto container py-4 px-4 sm:px-6 lg:px-8">
        <div class="md:flex items-center md:justify-between">
          <div class="min-w-0 flex-1 flex items-center">
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
              class="
                text-2xl
                font-medium
                leading-7
                text-gray-900
                sm:truncate sm:text-2xl sm:tracking-tight
                focus:outline-none
              "
              :size="data.pageTitle.length ? data.pageTitle.length - 4 : 20"
              :placeholder="today"
              v-model="data.pageTitle"
            />
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4">
            <span class="isolate inline-flex rounded-md">
              <button
                type="button"
                class="
                  relative
                  hidden
                  lg:inline-flex
                  items-center
                  rounded-md
                  bg-white
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-gray-700
                  hover:bg-gray-50
                  focus:z-10
                  focus:border-indigo-500
                  focus:outline-none
                  focus:ring-1
                  focus:ring-indigo-500
                "
                :class="!remainingSkips ? 'opacity-50' : ''"
                @click.prevent="sidePanelOpen = !sidePanelOpen"
              >
                <ForwardIcon class="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
                {{ remainingSkips ? "Skips" : "No skips available" }}
                <span
                  class="
                    items-center
                    rounded-full
                    bg-green-100
                    px-1.5
                    ml-1
                    py-0.5
                    text-xs
                    inline-flex
                    font-medium
                    text-green-800
                  "
                  v-if="remainingSkips"
                  >{{ remainingSkips }}</span
                >
              </button>
            </span>
            <button @click.prevent="() => (settingsOpened = true)">
              Settings
            </button>
            <button
              @click.prevent="
                () => {
                  data = clearState();
                }
              "
            >
              Reset Day
            </button>
            <button
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
            >
              Export
            </button>
            <button
              type="button"
              class="
                lg:ml-3
                w-full
                lg:w-auto
                justify-center
                inline-flex
                items-center
                rounded-md
                border border-transparent
                bg-indigo-600
                px-4
                py-2
                text-sm
                font-medium
                text-white
                shadow-sm
                hover:bg-indigo-700
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                focus:ring-offset-2
              "
              @click.prevent="() => addGroup()"
            >
              <PlusCircleIcon
                class="h-6 w-6 text-white mr-2"
                aria-hidden="true"
              />
              Add Group
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="container mx-auto" v-auto-animate>
      <div class="py-6">
        <div class="sm:hidden">
          <label for="tabs" class="sr-only">Select a tab</label>
          <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
          <select
            id="tabs"
            name="tabs"
            class="
              block
              w-full
              rounded-md
              border-gray-300
              focus:border-indigo-500 focus:ring-indigo-500
            "
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
          <nav class="flex space-x-4 justify-center" aria-label="Tabs">
            <a
              v-for="tab in tabs"
              href="#"
              :key="tab.name"
              @click.prevent="() => (data.currentView = tab.id)"
              :class="[
                (data.currentView ?? 'groups') === tab.id
                  ? 'bg-gray-200 text-gray-800'
                  : 'text-gray-600 hover:text-gray-800',
                'flex items-center px-3 py-2 font-medium text-sm rounded-md',
              ]"
              :aria-current="
                (data.currentView ?? 'groups') === tab.id ? 'page' : undefined
              "
            >
              <component :is="tab.icon" class="mr-1 h-4 w-4" />
              {{ tab.name }}
            </a>
          </nav>
        </div>
      </div>
      <div
        v-if="data.currentView === 'calendar'"
        class="
          divide-y divide-gray-200
          relative
          bg-no-repeat
          rounded-lg
          bg-white
          shadow
          sm:grid
          md:grid-cols-2
          lg:grid-cols-3
          sm:gap-px sm:divide-y-0
        "
      >
        <Calendar />
      </div>
      <div
        v-if="data.currentView === 'groups'"
        v-auto-animate
        class="
          divide-y divide-gray-200
          relative
          bg-no-repeat
          rounded-lg
          bg-gray-50
          shadow
          sm:grid
          md:grid-cols-2
          lg:grid-cols-3
          sm:gap-px sm:divide-y-1
        "
      >
        <div
          class="absolute inset-0 bg-no-repeat opacity-10"
          :style="`background-image: url(${imgBgUrl}); background-size: 600px; background-position: right 105%; z-index: 0; -webkit-filter: grayscale(100%); filter: grayscale(100%);`"
        >
          &nbsp;
        </div>
        <div
          v-for="(group, groupIndex) in data.groups"
          @mouseover="() => tagGroupAsCurrent(group)"
          :key="group.name"
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
            <div class="flex justify-between">
              <input
                class="
                  text-lg
                  font-medium
                  text-gray-900
                  focus:outline-none
                  bg-transparent
                "
                v-model.lazy="group.name"
                :id="`group-name-${group.id}`"
                :placeholder="'Group ' + (groupIndex + 1)"
              />
              <div v-if="isGroupHovered(group)">Active</div>
              <div class="flex items-center">
                <button
                  @click.prevent="() => pullTasks(group)"
                  class="
                    -my-2
                    -mr-4
                    hidden
                    items-center
                    rounded-full
                    group-hover:flex
                    bg-transparent
                    p-2
                    text-gray-400
                    hover:text-gray-600
                    focus:outline-none focus:ring-2 focus:ring-indigo-500
                  "
                >
                  <ArrowPathIcon class="h-5 w-5" />
                </button>
                <Menu as="div" class="relative ml-3 inline-block text-left">
                  <div>
                    <MenuButton
                      class="
                        -my-2
                        -mr-4
                        hidden
                        items-center
                        rounded-full
                        group-hover:flex
                        bg-transparent
                        p-2
                        text-gray-400
                        hover:text-gray-600
                        focus:outline-none focus:ring-2 focus:ring-indigo-500
                      "
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
                      class="
                        absolute
                        right-0
                        z-10
                        mt-2
                        w-72
                        origin-top-right
                        rounded-md
                        bg-white
                        shadow-lg
                        ring-1 ring-black ring-opacity-5
                        divide-y divide-gray-100
                        focus:outline-none
                      "
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
                              <span class="flex flex-grow flex-col">
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
                              class="
                                mr-3
                                h-5
                                w-5
                                text-gray-400
                                group-hover:text-gray-500
                              "
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
              class="mt-2 text-sm text-gray-500 focus:outline-none"
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

          <div v-if="!group.tasks.length" class="flex flex-grow">
            <Empty
              title="No Tasks"
              description="Create the first task for this group now."
            />
          </div>

          <div
            v-if="group.tasks.length"
            class="flex flex-col mt-6 w-full mb-auto pb-4"
            v-auto-animate
          >
            <div
              class="
                flex flex-1
                items-center
                py-4
                px-4
                border-l-4
                -mx-8
                group
                print:border-none
                transition-all
              "
              v-for="(task, taskIndex) in group.tasks"
              @mouseover="() => tagTaskAsCurrent(task)"
              :class="[
                isActive(groupIndex, taskIndex)
                  ? `${
                      group.ignore ? 'bg-white' : 'bg-gray-50'
                    } scale-[104%] shadow-md border border-gray-200 rounded-md transition-transform z-10`
                  : '',
                taskIndex >= data.settings.maxTasksPerGroup &&
                !isGroupOpened(group)
                  ? 'max-h-0 h-0 sm:py-0 overflow-hidden opacity-0'
                  : '',
                task.done ? 'order-last sm:flex' : '',
              ]"
              :style="{ borderLeftColor: getCategory(task.category).color }"
              :key="taskIndex"
            >
              <div class="flex flex-1">
                <TaskCheck v-model="task.done" />
                <div class="text-sm flex flex-1">
                  <label
                    :for="`task-name-${group.id}-${task.id}`"
                    class="
                      font-medium
                      text-gray-700
                      focus:b-0 focus:outline-none
                      flex flex-1
                    "
                  >
                    <input
                      :id="`task-name-${group.id}-${task.id}`"
                      class="
                        font-normal
                        text-gray-700
                        bg-transparent
                        focus:border-none focus:outline-none
                        flex flex-grow flex-1
                        truncate
                        mr-2
                      "
                      :class="[task.done ? 'line-through opacity-50' : '']"
                      v-model="task.title"
                      @dblclick="() => (current.task = task)"
                      @keyup.prevent.delete="
                        () => {
                          if (task.title.length === 0) {
                            deleteTask(group, task);
                          }
                          task.title = task.title.splice(-1);
                        }
                      "
                      @keyup.esc="
                        () => {
                          if (task.title.length === 0) {
                            deleteTask(group, task);
                          } else {
                            const input = getTaskTitleInput(group, task);
                            input?.blur();
                          }
                        }
                      "
                      @keyup.enter="
                        () => {
                          const input = getTaskTitleInput(group, task);
                          input?.blur();
                        }
                      "
                      @keyup.shift.enter.exact="() => addTask(group)"
                      placeholder="Task"
                    />
                    <span
                      v-if="task.counter"
                      class="
                        inline-flex
                        items-center
                        rounded-full
                        bg-gray-200
                        px-2.5
                        py-0.5
                        text-xs
                        font-medium
                        text-gray-800
                      "
                      >{{ task.counter }}</span
                    >
                  </label>
                  <span
                    class="inline-flex flex items-center"
                    v-html="applyFilters('task.labels', '', task, group)"
                  ></span>
                  <span
                    v-if="task.jumped"
                    class="
                      inline-flex
                      items-center
                      rounded
                      bg-gray-100
                      px-2
                      mr-1
                      inline-block
                      py-0.5
                      text-xs
                      font
                      text-gray-800
                    "
                    >Skipped once</span
                  >

                  <Menu
                    as="div"
                    class="relative inline-block text-left justify-self-end"
                  >
                    <div>
                      <MenuButton
                        class="
                          hidden
                          group-hover:flex
                          items-center
                          rounded-full
                          text-gray-400
                          hover:text-gray-600
                          focus:outline-none
                          focus:ring-2
                          focus:ring-indigo-500
                          focus:ring-offset-2
                          focus:ring-offset-gray-100
                        "
                      >
                        <span class="sr-only">Open options</span>
                        <EllipsisVerticalIcon
                          class="h-5 w-5"
                          aria-hidden="true"
                        />
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
                        class="
                          absolute
                          right-0
                          z-10
                          mt-2
                          w-56
                          origin-top-right
                          divide-y divide-gray-100
                          rounded-md
                          bg-white
                          shadow-lg
                          ring-1 ring-black ring-opacity-5
                          focus:outline-none
                        "
                      >
                        <div class="py-1">
                          <MenuItem v-slot="{ active }">
                            <a
                              @click.prevent="
                                () => pickTask(task, taskIndex, groupIndex)
                              "
                              href="#"
                              :class="[
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'group flex items-center px-4 py-2 text-sm',
                              ]"
                            >
                              <BoltIcon
                                class="
                                  mr-3
                                  h-5
                                  w-5
                                  text-gray-400
                                  group-hover:text-gray-500
                                "
                                aria-hidden="true"
                              />
                              Pick Task
                            </a>
                          </MenuItem>
                        </div>
                        <div class="py-1">
                          <small class="px-4 py-1 block">Category</small>
                          <MenuItem
                            v-slot="{ active }"
                            v-for="(category, index) in data.categories"
                            :key="index"
                          >
                            <a
                              href="#"
                              @click.prevent="
                                () => {
                                  data.lastCategory = snakeCase(category.name);
                                  task.category = snakeCase(category.name);
                                }
                              "
                              :class="[
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'group flex items-center px-4 py-2 text-sm justify-between',
                              ]"
                            >
                              <span class="flex">
                                <TagIcon
                                  class="mr-3 h-5 w-5"
                                  :style="{ color: category.color }"
                                  aria-hidden="true"
                                />
                                {{ category.name }}
                              </span>
                              <CheckIcon
                                v-if="taskHasCategory(task, category.name)"
                                class="h-3 w-3 text-green-700"
                              />
                            </a>
                          </MenuItem>
                        </div>

                        <!-- Move Between Groups -->
                        <div class="py-1">
                          <small class="px-4 py-1 block">Move to</small>
                          <MenuItem
                            v-slot="{ active }"
                            v-for="(someGroup, someGroupIndex) in data.groups"
                            :key="someGroupIndex"
                          >
                            <a
                              href="#"
                              @click.prevent="
                                () => {
                                  // Copy task
                                  const taskCopy = Object.assign({}, task);
                                  // Remove from existing group
                                  group.tasks.splice(taskIndex, 1);
                                  // Add to new group
                                  someGroup.tasks.push(taskCopy);
                                }
                              "
                              :class="[
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'group flex items-center px-4 py-2 text-sm justify-between',
                              ]"
                            >
                              <span class="flex">
                                <component
                                  :is="
                                    someGroup.ignore
                                      ? ArchiveBoxArrowDownIcon
                                      : ClipboardDocumentCheckIcon
                                  "
                                  class="
                                    mr-3
                                    h-5
                                    w-5
                                    text-gray-400
                                    group-hover:text-gray-500
                                  "
                                  aria-hidden="true"
                                />
                                {{ someGroup.name }}
                              </span>
                              <CheckIcon
                                v-if="someGroupIndex === groupIndex"
                                class="h-3 w-3 text-green-700"
                              />
                            </a>
                          </MenuItem>
                        </div>

                        <div class="py-1">
                          <MenuItem v-slot="{ active }">
                            <a
                              @click.prevent="() => deleteTask(group, task)"
                              href="#"
                              :class="[
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'group flex items-center px-4 py-2 text-sm',
                              ]"
                            >
                              <TrashIcon
                                class="
                                  mr-3
                                  h-5
                                  w-5
                                  text-gray-400
                                  group-hover:text-gray-500
                                "
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
            </div>
          </div>

          <div
            v-if="group.tasks.length > data.settings.maxTasksPerGroup"
            class=""
          >
            <a
              href="#"
              class="text-xs text-gray-400 flex justify-items-center"
              @click.prevent="
                () => {
                  toggleGroup(group);
                }
              "
            >
              <component
                :is="
                  isGroupOpened(group) ? ArrowUpCircleIcon : ArrowDownCircleIcon
                "
                class="h-4 w-4 mr-1"
                aria-hidden="true"
              />
              <span
                v-text="
                  isGroupOpened(group) ? 'Hide extra Tasks' : 'See all Tasks'
                "
              ></span>
            </a>
          </div>

          <div class="flex justify-end" v-if="group.tasks.length">
            <button
              type="button"
              class="
                inline-flex
                items-center
                rounded-full
                border border-transparent
                bg-indigo-600
                p-1
                text-white
                shadow-sm
                hover:bg-indigo-700
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                focus:ring-offset-2
              "
              @click.prevent="
                () => {
                  group.tasks.push(new Task('', '', data.lastCategory));
                  focusLastTask(group);
                }
              "
            >
              <PlusIconMini class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
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

    <ActiveTaskBar :task="currentTask" :fullScreen="false">
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
        class="
          inline-flex
          items-center
          rounded-md
          px-4
          py-2
          text-sm
          font-medium
          text-white
          shadow-sm
          hover:bg-indigo-500
          focus:outline-none
          focus:ring-2
          focus:ring-indigo-500
          focus:ring-offset-2
        "
      >
        <ForwardIcon class="lg:mr-2 lg:-ml-1 h-5 w-5" aria-hidden="true" />
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
        v-if="currentTask"
        @click.prevent="() => start(currentTask)"
        class="
          flex
          items-center
          justify-center
          rounded-md
          border border-transparent
          bg-white
          px-4
          py-2
          text-sm
          font-medium
          text-indigo-600
          shadow-sm
          hover:bg-indigo-50
          group
        "
        href="#"
      >
        <PlayIcon class="lg:mr-2 lg:-ml-1 h-5 w-5" aria-hidden="true" />
        <span class="transition ease-out duration-200 hidden lg:block"
          >Start</span
        >
      </a>
      <a
        v-if="currentTask"
        @click.prevent="completeTaskAndPickNext"
        class="
          flex
          items-center
          justify-center
          rounded-md
          border border-transparent
          bg-white
          px-4
          py-2
          text-sm
          font-medium
          text-indigo-600
          shadow-sm
          hover:bg-indigo-50
          group
        "
        href="#"
      >
        <CheckCircleIcon class="lg:mr-2 lg:-ml-1 h-5 w-5" aria-hidden="true" />
        <span class="transition ease-out duration-200 hidden lg:block"
          >I'm done</span
        >
      </a>

      <button
        v-if="!currentTask"
        class="
          flex
          items-center
          justify-center
          rounded-md
          border border-transparent
          bg-white
          px-4
          py-2
          text-sm
          font-medium
          text-indigo-600
          shadow-sm
          hover:bg-indigo-50
        "
        @click.prevent="() => pickATask()"
      >
        <BoltIcon class="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
        <span class="">Pick Task</span>
      </button>
    </ActiveTaskBar>

    <SidePanel title="History" :open="sidePanelOpen">
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
    </SidePanel>
    <TaskDetails v-if="current.task" v-model="current" />
    <!-- <Settings
      :open="settingsOpened"
      :categories="data.categories"
      @update:categories="(categories) => (data.categories = categories)"
      @close="() => (settingsOpened = false)"
      v-model="data.settings"
    ></Settings> -->
  </div>
</template>

<style scoped>
.pretty.p-icon .state .icon {
  border-width: 2px !important;
}
</style>
