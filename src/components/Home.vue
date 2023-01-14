<script setup lang="ts">
import { onMounted, onUpdated, ref, computed, nextTick } from "vue";
import QRCodeVue3 from "qrcode-vue3";
import LZString from "lz-string";
import {
  flatten,
  template,
  templateSettings,
  capitalize,
  snakeCase,
  defaultsDeep,
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

const endpoint = "https://api.linear.app/graphql";
const query = `query { issues(filter: { 
    assignee: { email: { eq: "arindo@wpultimo.com" } }
  }) { nodes { id identifier title dueDate description url state { id name } } } }`;

const variables = {};

const headers = {
  "Content-Type": "application/json",
  Authorization: import.meta.env.VITE_LINEAR_PERSONAL_ACCESS_TOKEN,
};

const options = {
  method: "POST",
  headers,
  body: JSON.stringify({ query, variables }),
};

fetch(endpoint, options)
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));

const loading = ref(true);

const sidePanelOpen = ref(false);

const currentUrl = ref("");

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

// Api key authentication

templateSettings.interpolate = /{{([\s\S]+?)}}/g;

const compileTemplate = template(data.value.settings.actionStart);

const focusLastTask = (group, groupIndex) => {
  document
    .getElementById(`task-name-${groupIndex}-${group.tasks.length - 1}`)
    .focus();
};

const currentTask = ref(null);

class Task {
  done = false;

  category = "";

  jumped = false;

  counter = 0;

  title = "My Task";

  description = "";

  constructor(task = "My Task", description = "") {
    this.title = task;
    this.description = description;
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

class Group {
  id = null;

  name = null;

  ignore = false;

  tasks: Task[] = [];

  constructor() {}
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

  console.log(window.location.hash);

  currentUrl.value = window.location.toString();

  const state = JSON.parse(
    LZString.decompressFromEncodedURIComponent(window.location.hash.slice(1))
  );

  console.log(state);

  state.settings = defaultsDeep(state.settings, defaultSettings);

  data.value = state;
};

const selectedTask = computed(() => {
  return data.value.history.slice(-1)[0];
});

const jump = ($event) => {
  $event.preventDefault();
  if (currentTask.value === null) {
    return;
  }
  currentTask.value.jumped = true;

  pickATask();
};

const completeTaskAndPickNext = ($event) => {
  // $event.preventDefault();
  pickATask();
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

onUpdated(updateUrlWithState);

onMounted(() => {
  console.log("Loaded");

  extractStateFromUrl();

  if (selectedTask.value) {
    currentTask.value =
      data.value.groups[selectedTask.value[0]].tasks[selectedTask.value[1]];
  }

  nextTick(() => (loading.value = false));
});
</script>

<template>
  <div class="bg-gray-100 pb-24">
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
                @click="sidePanelOpen = !sidePanelOpen"
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
              @click="() => data.groups.push(new Group())"
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

    <div class="container mx-auto py-10">
      <div
        class="
          divide-y divide-gray-200
          rounded-lg
          bg-gray-200
          shadow
          sm:grid
          md:grid-cols-2
          lg:grid-cols-3
          sm:gap-px sm:divide-y-0
        "
      >
        <div
          v-for="(group, groupIndex) in data.groups"
          :key="group.name"
          :class="[
            groupIndex === 0
              ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none'
              : '',
            groupIndex === 2 ? 'sm:rounded-tr-lg' : '',
            groupIndex === data.groups.length - 1 ? 'sm:rounded-bl-lg' : '',
            groupIndex === data.groups.length - 0
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
                :placeholder="'Group ' + (groupIndex + 1)"
              />
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
                                group.ignore ? 'bg-indigo-600' : 'bg-gray-200',
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
                          @click="
                            ($event) => {
                              $event.preventDefault();
                              data.groups.splice(groupIndex, 1);
                            }
                          "
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
            <p class="mt-2 text-sm text-gray-500">
              Doloribus dolores nostrum quia qui natus officia quod et dolorem.
              Sit repellendus qui ut at blanditiis et quo et molestiae.
            </p>
          </div>

          <div v-if="!group.tasks.length" class="flex flex-grow">
            <Empty
              title="No Tasks"
              description="Create the first task for this group now."
            />
          </div>

          <div class="flex flex-col mt-6 w-full mb-auto pb-4">
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
              :class="[
                isActive(groupIndex, taskIndex) ? 'bg-gray-100' : '',
                taskIndex >= data.settings.maxTasksPerGroup &&
                !isGroupOpened(group)
                  ? 'max-h-0 h-0 sm:py-0 overflow-hidden opacity-0'
                  : '',
                task.done ? 'order-last sm:flex' : '',
              ]"
              :style="{ borderColor: getCategory(task.category).color }"
              :key="taskIndex"
            >
              <div class="flex flex-1">
                <div class="flex items-center">
                  <div class="pretty p-icon p-round p-smooth p-thick">
                    <input type="checkbox" v-model="task.done" />
                    <div class="state p-success-o">
                      <CheckIcon class="icon" aria-hidden="true" />
                      <label> </label>
                    </div>
                  </div>
                </div>
                <div class="text-sm flex flex-1">
                  <label
                    :for="`task-name-${groupIndex}-${taskIndex}`"
                    class="
                      font-medium
                      text-gray-700
                      focus:b-0 focus:outline-none
                      flex flex-1
                    "
                  >
                    <input
                      :id="`task-name-${groupIndex}-${taskIndex}`"
                      class="
                        font-normal
                        text-gray-700
                        bg-transparent
                        focus:border-none focus:outline-none
                        flex flex-grow flex-1
                        truncate
                      "
                      :class="[task.done ? 'line-through opacity-50' : '']"
                      v-model.lazy="task.title"
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
                              @click="
                                ($event) => {
                                  $event.preventDefault();

                                  pickTask(task, taskIndex, groupIndex);
                                }
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
                              @click="
                                ($event) => {
                                  $event.preventDefault();
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
                              @click="
                                ($event) => {
                                  $event.preventDefault();
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
                              @click="
                                ($event) => {
                                  $event.preventDefault();
                                  group.tasks.splice(taskIndex, 1);
                                }
                              "
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
                  <!-- <p
                  id="comments-description"
                  :class="isActive(groupIndex, taskIndex) ? 'block' : 'hidden'"
                  class="text-gray-500 group-hover:block"
                >
                  <textarea
                    class="
                      text-gray-500
                      focus:outline-none
                      p-0
                      m-0
                      bg-transparent
                      border-none
                      text-sm
                      focus:border-none
                      outline-none
                      w-full
                    "
                    :rows="Math.floor(task.description.length / 200)"
                    v-model.lazy="task.description"
                    placeholder="Task description"
                  ></textarea>
                </p> -->
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="
              group.tasks.filter((task) => !task.done).length >
              data.settings.maxTasksPerGroup
            "
            class=""
          >
            <a
              href="#"
              class="text-xs text-gray-400 flex justify-items-center"
              @click="
                ($event) => {
                  $event.preventDefault();
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

          <div class="flex justify-end">
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
              @click="
                () => {
                  group.tasks.push(new Task(''));
                  nextTick(() => {
                    focusLastTask(group, groupIndex);
                  });
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

    <ActiveTaskBar :task="currentTask">
      <button
        v-if="currentTask"
        :disabled="
          !(currentTask !== null && !currentTask.jumped) || !remainingSkips
        "
        @click="jump"
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
        :href="
          compileTemplate({
            taskTitle: currentTask.title ?? 'No Title',
            taskCategory: currentTask.category,
            taskDescription: currentTask.description,
            duration: data.settings.pomodoroLength,
          })
        "
      >
        <PlayIcon class="lg:mr-2 lg:-ml-1 h-5 w-5" aria-hidden="true" />
        <span class="transition ease-out duration-200 hidden lg:block"
          >Start</span
        >
      </a>
      <a
        v-if="currentTask"
        @click="completeTaskAndPickNext"
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
        :href="data.settings.actionComplete"
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
        @click="() => pickATask()"
      >
        <BoltIcon class="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
        <span class="">Pick Task</span>
      </button>
    </ActiveTaskBar>

    <SidePanel title="History" :open="sidePanelOpen">
      <div>
        <div>
          <div class="mb-6">
            <!-- <label for="email" class="block text-sm font-medium text-gray-700"
              >Search candidates</label
            > -->
            <div
              class="mt-1 flex rounded-md shadow-sm"
              v-for="(category, index) in data.categories"
            >
              <div
                class="relative flex flex-grow items-stretch focus-within:z-10"
              >
                <input
                  type="email"
                  name="email"
                  id="email"
                  v-model="category.name"
                  class="
                    block
                    w-full
                    rounded-none rounded-l-md
                    border-gray-300
                    focus:border-indigo-500 focus:ring-indigo-500
                    sm:text-sm
                  "
                  placeholder="Category name"
                />
              </div>
              <div
                type="button"
                class="
                  relative
                  -ml-px
                  inline-flex
                  items-center
                  space-x-2
                  rounded-r-md
                  border border-gray-300
                  bg-gray-50
                  px-3
                  py-0
                  text-sm
                  font-medium
                  text-gray-700
                  hover:bg-gray-100
                  focus:border-indigo-500
                  focus:outline-none
                  focus:ring-1
                  focus:ring-indigo-500
                "
              >
                <label>
                  <span
                    class="inline-block h-3 w-3 rounded-full"
                    :style="{ backgroundColor: category.color }"
                    >&nbsp;</span
                  >
                  <input
                    v-model="category.color"
                    type="color"
                    class="w-0 opacity-0"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
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
  </div>
</template>

<style scoped>
@import "pretty-checkbox";

.pretty.p-icon .state .icon {
  border-width: 2px !important;
}
</style>
