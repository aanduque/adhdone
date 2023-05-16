<script setup lang="ts">
import {
  CheckIcon,
  XMarkIcon,
  ArchiveBoxArrowDownIcon,
  ClipboardDocumentCheckIcon,
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
import { toRefs, defineEmits, onMounted, onUpdated, ref, computed } from "vue";
import { filter, partition, remove, snakeCase, isNull, clone } from "lodash";
import { addAction, addFilter, applyFilters, doAction } from "@wordpress/hooks";
import { VueDraggableNext } from "vue-draggable-next";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";

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

const currentInput = ref(null)

const setCurrentInput = (input, task) => {
  console.log(input, task)
  currentInput.value = clone(task)
}

const focusedTaskId = computed(() => {
  console.log('the id', currentInput.value?.id)
  return currentInput.value?.id
})

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

addAction('task.process.title', 'core', (title, task, group) => task.title = title)

// addAction('task.process.title', 'core', (title, task, group) => console.log(title))

const processTaskTitle = (title, task, group) => doAction('task.process.title', title, task, group);
const processTaskTitleView = (title, task, group) => applyFilters('task.process.title.view', title, task, group);

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
  <div class="mb-auto">
    <div
      class="relative flex w-full flex-col"
      :class="
        (displayEmptyBlock ?? false) && !modelValue.length
          ? 'min-h-[155px]'
          : ''
      "
      v-auto-animate
    >
      <div
        class="absolute inset-0 z-[0] px-4"
        v-if="(displayEmptyBlock ?? false) && !modelValue.length"
      >
        <Empty
          class=""
          title="No Tasks"
          description="Create the first task for this group now."
        />
      </div>

      <VueDraggableNext
        v-if="modelValue"
        :modelValue="modelValue"
        @update:modelValue="(data) => emit('update:modelValue', data)"
        ghost-class="ghost"
        :class="
          (displayEmptyBlock ?? false) && !modelValue.length
            ? 'min-h-[150px]'
            : ''
        "
        :group="{
          name: scope,
          pull: true,
          put: maxTasks ? modelValue.length < maxTasks : true,
        }"
      >
        <div
          class="
            flex flex-1
            items-center
            py-4
            px-4
            border-l-4
            group
            print:border-none
            transition-all
          "
          v-for="(task, taskIndex) in modelValue"
          @mouseover="() => emit('task:mouseover', task, group)"
          :class="[
            'bg-white',
            itemClasses ?? '',
            isTaskSelected(task) ? 'bg-gray-100' : '',
            isTaskActive(task)
              ? `${
                  group.ignore ? 'bg-white' : 'bg-gray-50'
                } scale-[104%] shadow-md border border-gray-200 rounded-md transition-transform z-20`
              : '',
            // taskIndex >= data.settings.maxTasksPerGroup &&
            // !isGroupOpened(group)
            //   ? 'max-h-0 h-0 sm:py-0 overflow-hidden opacity-0'
            //   : '',
            task.done || (task.canceled ?? false) ? 'sm:flex' : '',
          ]"
          :style="{ borderLeftColor: getCategory(task.category).color }"
          :key="taskIndex"
        >
          <div class="flex flex-1">
            <TaskCheck
              v-model="task.done"
              v-if="!(task.canceled ?? false)"
              @change="
                (value) =>
                  value
                    ? emit('task:done', task, group, taskIndex)
                    : emit('task:undone', task, group, taskIndex)
              "
            />
            <TaskCanceledCheck v-else v-tooltip="'This task was canceled'" />

            <div class="text-sm flex flex-1 gap-2">
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
                  @input="(event) => processTaskTitle(event.target.value, task, group)"
                  :value="task.title"
                  :class="[
                    task.done || task?.canceled
                      ? 'line-through opacity-50'
                      : '',
                  ]"
                  @dblclick="() => emit('task:dblclick', task)"
                  @keydown.delete="
                    (e) => {
                      if (task.title.length === 0) {
                        e.preventDefault();
                        emit('task:delete', task, group);
                      }
                    }
                  "
                  @keyup.esc="
                    () => {
                      if (task.title.length === 0) {
                        emit('task:delete', task, group);
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
                  @keyup.shift.enter.exact="
                    () => {
                      emit('task:create', group, 'after');
                    }
                  "
                  placeholder="Task"
                />
              </label>
              <span
                class="inline-flex flex items-center mx-1"
                v-html="applyFilters('task.labels', '', task, group)"
              ></span>

              <span
                title="Recurring"
                v-tooltip="'This task is recurring'"
                v-if="task?.recurring"
                class="top-[-0.5px] flex items-center text-xs text-gray-600"
              >
                <ArrowPathIcon class="h-3 w-3" />
              </span>

              <span
                v-if="task.jumped"
                v-tooltip="
                  `This task was skipped ${Number(task.jumped)} time(s)`
                "
                class="flex items-center text-xs text-gray-600"
              >
                <ForwardIcon class="top-[-1px] mr-0.5 h-4 w-4" />
                <span class="top-[-1px]">{{ Number(task.jumped) }}</span>
              </span>

              <span
                v-if="task.counter"
                v-tooltip="`This task was picked ${task.counter} time(s)`"
                class="flex items-center text-xs text-gray-600"
              >
                <XMarkIcon class="h-3 w-3" />
                <span class="top-[-1px]">{{ task.counter }}</span>
              </span>
              <!-- Menu -->

              <Menu
                as="div"
                class="
                  relative
                  inline-block
                  text-left
                  justify-self-end
                  drag-item
                "
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
                    class="
                      absolute
                      right-0
                      z-20
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
                            () => emit('task:picked', task, group)
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
                      <MenuItem v-slot="{ active }">
                        <a
                          @click.prevent="
                            () =>
                              (task.recurring = task.recurring
                                ? !task.recurring
                                : true)
                          "
                          href="#"
                          :class="[
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'group flex items-center px-4 py-2 text-sm justify-between',
                          ]"
                        >
                          <span class="flex">
                            <ArrowPathIcon
                              class="
                                mr-3
                                h-5
                                w-5
                                text-gray-400
                                group-hover:text-gray-500
                              "
                              aria-hidden="true"
                            />
                            Recurring
                          </span>
                          <CheckIcon
                            v-if="task.recurring"
                            class="h-3 w-3 text-green-700"
                          />
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
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700',
                            'group flex items-center px-4 py-2 text-sm',
                          ]"
                        >
                          <XMarkIcon
                            class="
                              mr-3
                              h-5
                              w-5
                              text-gray-400
                              group-hover:text-gray-500
                            "
                            aria-hidden="true"
                          />
                          Cancel
                        </a>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <a
                          @click.prevent="
                            () => emit('task:delete', task, group)
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
              <!-- End Menu -->
            </div>
          </div>
        </div>
      </VueDraggableNext>
    </div>
  </div>
</template>
