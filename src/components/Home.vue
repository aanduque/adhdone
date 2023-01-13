<script setup lang="ts">
import { onMounted, onUpdated, ref, computed, nextTick, Ref } from "vue";
import QRCodeVue3 from "qrcode-vue3";
import LZString from "lz-string";
import {
  flatten,
  template,
  templateSettings,
  capitalize,
  snakeCase,
} from "lodash";
import moment from "moment/min/moment-with-locales";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { EllipsisVerticalIcon } from "@heroicons/vue/20/solid";
import ActiveTaskBar from "./ActiveTaskBar.vue";
import SidePanel from "./SidePanel.vue";
import Empty from "./Empty.vue";
import ProgressBar from "./ProgressBar.vue";
import {
  PlusCircleIcon,
  PlayIcon,
  ForwardIcon,
  PlusIcon,
  BoltIcon,
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
  TrashIcon,
  UserPlusIcon,
} from "@heroicons/vue/20/solid";

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
      color: "red",
    },
    {
      name: "Personal",
      color: "blue",
    },
    {
      name: "Development",
      color: "indigo",
    },
  ],
  settings: {
    lang: "pt-br",
    maxGroups: 3,
    maxTasksPerGroup: 5,
    maxRoundsPerTask: 3,
    pomodoroLength: 25,
    maxSkips: 3,
    actionStart:
      "session:///start?intent={{taskTitle}}&duration={{duration}}&notes={{taskDescription}}&categoryName={{taskCategory}}",
  },
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

templateSettings.interpolate = /{{([\s\S]+?)}}/g;

const compileTemplate = template(data.value.settings.actionStart);

const focusLastTask = (tasks) => {
  document.getElementById(`task-name-${tasks.length - 1}`).focus();
};

const currentTask: Ref<Task | null> = ref(null);

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
  <div>
    <header class="bg-white shadow-sm print:hidden">
      <div class="mx-auto max-w-7xl py-4 px-4 sm:px-6 lg:px-8">
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
                font-bold
                leading-7
                text-gray-900
                sm:truncate sm:text-2xl sm:tracking-tight
                focus:outline-none
              "
              :size="data.pageTitle.length ? data.pageTitle.length : 20"
              :placeholder="today"
              v-model="data.pageTitle"
            />
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4">
            <span class="isolate inline-flex rounded-md shadow-sm">
              <button
                type="button"
                class="
                  relative
                  inline-flex
                  items-center
                  rounded-l-md
                  border border-gray-300
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
                    inline-flex
                    items-center
                    rounded-full
                    bg-green-100
                    px-1.5
                    ml-1
                    py-0.5
                    text-xs
                    font-medium
                    text-green-800
                  "
                  v-if="remainingSkips"
                  >{{ remainingSkips }}</span
                >
              </button>
              <button
                type="button"
                class="
                  relative
                  inline-flex
                  items-center
                  border border-gray-300
                  bg-white
                  px-4
                  py-2
                  text-sm
                  -ml-px
                  font-medium
                  text-gray-700
                  hover:bg-gray-50
                  focus:z-10
                  focus:border-indigo-500
                  focus:outline-none
                  focus:ring-1
                  focus:ring-indigo-500
                "
                @click="sidePanelOpen = !sidePanelOpen"
              >
                History
              </button>
              <button
                type="button"
                class="
                  relative
                  -ml-px
                  inline-flex
                  items-center
                  rounded-r-md
                  border border-gray-300
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
              >
                Categories
              </button>
            </span>
            <button
              type="button"
              class="
                ml-3
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
              Add new Group
            </button>
          </div>
        </div>
      </div>
    </header>
    <ProgressBar :completed="completedTasks" :total="totalTasks" />
    <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-4 sm:px-0">
        <div class="grid grid-cols-3 gap-4">
          <div
            class="space-y-2 p-4 rounded-lg flex flex-col gap-0"
            v-for="(group, groupIndex) in data.groups"
            :class="
              group.ignore
                ? 'bg-gray-50 border-2 border-dashed border-gray-200 order-last'
                : ''
            "
            :key="groupIndex"
          >
            <div class="border-b border-gray-200 pb-2">
              <div class="sm:flex sm:items-baseline sm:justify-between">
                <div class="sm:w-0 sm:flex-1">
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
                  <!-- <h1
                    id="message-heading"
                    class="text-lg font-medium text-gray-900"
                  >
                    Full-Stack Developer
                  </h1> -->
                  <!-- <p class="mt-1 truncate text-sm text-gray-500">
                    Checkout and Payments Team
                  </p> -->
                </div>

                <div
                  class="
                    mt-4
                    flex
                    items-center
                    justify-between
                    sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:justify-start
                  "
                >
                  <!-- <span
                    class="
                      inline-flex
                      items-center
                      rounded-full
                      bg-green-100
                      px-3
                      py-0.5
                      text-sm
                      font-medium
                      text-green-800
                    "
                    >Open</span
                  > -->
                  <Menu as="div" class="relative ml-3 inline-block text-left">
                    <div>
                      <MenuButton
                        class="
                          -my-2
                          flex
                          items-center
                          rounded-full
                          bg-transparent
                          p-2
                          text-gray-400
                          hover:text-gray-600
                          focus:outline-none focus:ring-2 focus:ring-indigo-500
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
                              <span>Ignore</span>
                              <input
                                id="ignore"
                                aria-describedby="ignore-description"
                                name="ignore"
                                type="checkbox"
                                class="
                                  h-4
                                  w-4
                                  rounded
                                  border-gray-300
                                  text-indigo-600
                                  focus:ring-indigo-500
                                "
                                v-model="group.ignore"
                              />
                            </a>
                          </MenuItem>
                        </div>
                        <div class="py-1">
                          <MenuItem v-slot="{ active }">
                            <a
                              @click="
                                () => {
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
              </div>
            </div>

            <Empty
              v-if="!group.tasks.length"
              title="No Tasks"
              description="Create your first task now."
            ></Empty>

            <div class="flex flex-col flex-1">
              <div
                class="
                  flex
                  w-full
                  items-center
                  p-2
                  rounded-sm
                  border-l-4
                  group
                  print:border-none
                "
                v-for="(task, taskIndex) in group.tasks"
                :class="[
                  isActive(groupIndex, taskIndex) ? 'bg-gray-50' : '',
                  task.done ? 'opacity-50' : '',
                ]"
                :style="{ borderColor: getCategory(task.category).color }"
                :key="taskIndex"
              >
                <div class="flex h-5 items-center">
                  <input
                    aria-describedby="comments-description"
                    name="comments"
                    type="checkbox"
                    class="
                      h-4
                      w-4
                      rounded
                      border-gray-300
                      text-indigo-600
                      focus:ring-indigo-500
                    "
                    v-model="task.done"
                  />
                </div>
                <div class="ml-3 text-sm">
                  <label
                    for="comments"
                    class="
                      font-medium
                      text-gray-700
                      focus:b-0 focus:outline-none
                      flex flex-grow flex-1
                    "
                  >
                    <input
                      :id="`task-name-${taskIndex}`"
                      class="
                        font-medium
                        text-gray-700
                        bg-transparent
                        focus:border-none focus:outline-none
                        flex flex-grow
                      "
                      :class="[task.done ? 'line-through' : '']"
                      v-model.lazy="task.title"
                      :size="task.title.length ? task.title.length : 20"
                      placeholder="Task"
                    />
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
                            bg-gray-100
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
                                  'group flex items-center px-4 py-2 text-sm',
                                ]"
                              >
                                <span
                                  class="mr-3 h-3 w-3 rounded-full"
                                  :style="{ backgroundColor: category.color }"
                                  >&nbsp;</span
                                >
                                {{ category.name }}
                              </a>
                            </MenuItem>
                          </div>

                          <div class="py-1">
                            <MenuItem v-slot="{ active }">
                              <a
                                @click="
                                  () => {
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
                  </label>
                  <p
                    id="comments-description"
                    :class="
                      isActive(groupIndex, taskIndex) ? 'block' : 'hidden'
                    "
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
                  </p>
                </div>
              </div>
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
                      focusLastTask(group.tasks);
                    });
                  }
                "
              >
                <PlusIconMini class="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <!-- 
        <div>
          Categorias:
          <div
            class="flex items-center justify-center"
            v-for="(category, index) in data.categories"
            :key="index"
          >
            <span
              :class="['h-3', 'w-3', 'rounded-full', 'mr-2']"
              :style="{ backgroundColor: category.color }"
              >&nbsp;</span
            >
            <input
              class="
                font-medium
                text-gray-700
                bg-transparent
                focus:border-none focus:outline-none
                flex flex-grow
              "
              v-model.lazy="category.name"
              placeholder="Category Name"
            />
          </div>
          <button
            @click="
              () =>
                data.categories.push({ name: 'New Category', color: 'blue' })
            "
          >
            Add new Category
          </button>
        </div> -->
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
        @click="() => jump()"
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
        <ForwardIcon class="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
        {{
          !(currentTask !== null && !currentTask.jumped)
            ? "Already Skipped"
            : remainingSkips
            ? "Skip"
            : "No skips left"
        }}
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
        <PlayIcon class="mr-2 -ml-1 h-5 w-5" aria-hidden="true" />
        Start
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
        Pick Task
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
  </div>
</template>

<style scoped>
</style>
