<script setup lang="ts">
import {
  CheckIcon,
  XMarkIcon,
  EllipsisVerticalIcon,
  BoltIcon,
  TagIcon,
  TrashIcon,
  ArrowPathIcon,
  ForwardIcon,
} from "@heroicons/vue/24/outline";
import TaskCheck from "./TaskCheck.vue";
import TaskCanceledCheck from "./TaskCanceledCheck.vue";
import Empty from "./Empty.vue";
import { toRefs, onMounted, onUpdated, ref, computed } from "vue";
import { partition, snakeCase, clone } from "lodash";
import { addAction, applyFilters, doAction } from "@wordpress/hooks";
import { VueDraggableNext } from "vue-draggable-next";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import EditableText from "./EditableText.vue";

const props = defineProps<{
  pickedTask?: Record<string, any>;
  selectedTasks?: Record<string, any>[];
  group: Record<string, any>;
  categories: Array<Record<any, any>>;
  modelValue: Array<Record<any, any>>;
  maxTasks?: number;
  itemClasses?: string | string[];
  itemActiveClasses?: string | string[];
  scope: string;
  displayEmptyBlock?: boolean;
}>();

const {
  modelValue,
  selectedTasks,
  pickedTask,
  group,
  categories,
  scope,
  maxTasks,
} = toRefs(props);

const c = console;

const isTaskSelected = (task) => {
  return selectedTasks.value.includes(task.id);
};

const taskHasCategory = (task, categoryId) => {
  const category = getCategory(task.category);

  return snakeCase(category.name) === snakeCase(categoryId);
};

const getCategory = (categoryId: string) => {
  return (
    categories.value.filter(
      (category) => snakeCase(category.name) === snakeCase(categoryId)
    )[0] ?? {
      name: "No category",
      color: "#f9f9f9",
    }
  );
};

const getTaskTitleInput = (group, task) => {
  return document.getElementById(`task-name-${group.id}-${task.id}`);
};

const isTaskActive = (task) => {
  return pickedTask?.value?.id === task.id;
};

addAction(
  "task.process.title",
  "core",
  (title, task, group) => (task.title = title)
);

// addAction('task.process.title', 'core', (title, task, group) => console.log(title))

const processTaskTitle = (title, task, group) =>
  doAction("task.process.title", title, task, group);
const processTaskTitleView = (title, task, group) =>
  applyFilters("task.process.title.view", title, task, group);

const emit = defineEmits([
  "update:modelValue",
  "task:dblclick",
  "task:picked",
  "task:delete",
  "list:overflow",
  "task:mouseover",
  "task:create",
  "task:done",
  "task:undone",
  "task:canceled",
  "update:lastCategory",
]);

const checkOverflow = () => {
  if (maxTasks?.value && modelValue.value.length > maxTasks?.value) {
    let index = 0;
    const blocks = partition(modelValue.value, (task) => {
      const keep = index < maxTasks.value!;
      index++;
      return keep;
    });
    if (blocks.length === 2) {
      emit("update:modelValue", blocks[0]);
      emit("list:overflow", blocks[1]);
    }
  }
};

onUpdated(checkOverflow);
onMounted(checkOverflow);
</script>

<template>
  <Menu as="div" class="relative inline-block text-left justify-self-end">
    <div>
      <MenuButton
        class="flex items-center rounded-full text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
      >
        <span class="sr-only">Open options</span>
        <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
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
              @click.prevent="() => emit('task:picked', task, group)"
              href="#"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'group flex items-center px-4 py-2 text-sm',
              ]"
            >
              <BoltIcon
                class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
              Pick Task
            </a>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a
              @click.prevent="
                () => (task.recurring = task.recurring ? !task.recurring : true)
              "
              href="#"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'group flex items-center px-4 py-2 text-sm justify-between',
              ]"
            >
              <span class="flex">
                <ArrowPathIcon
                  class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                Recurring
              </span>
              <CheckIcon v-if="task.recurring" class="h-3 w-3 text-green-700" />
            </a>
          </MenuItem>
        </div>
        <div class="py-1">
          <small class="px-4 py-1 block">Category</small>
          <MenuItem
            v-slot="{ active }"
            v-for="(category, index) in categories"
            :key="index"
          >
            <a
              href="#"
              @click.prevent="
                () => {
                  // data.lastCategory = snakeCase(category.name);
                  emit('update:lastCategory', category);
                  task.category = snakeCase(category.name);
                }
              "
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
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

        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <a
              @click.prevent="
                () => {
                  task.canceled = !(task.canceled ?? false);
                  c.log(task);
                }
              "
              href="#"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'group flex items-center px-4 py-2 text-sm',
              ]"
            >
              <XMarkIcon
                class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
              Cancel
            </a>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a
              @click.prevent="() => emit('task:delete', task, group)"
              href="#"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
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
</template>
