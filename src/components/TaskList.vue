<script setup lang="ts">
import {
  XMarkIcon,
  ArrowPathIcon,
  ForwardIcon,
} from "@heroicons/vue/24/outline";
import TaskCheck from "./TaskCheck.vue";
import TaskCanceledCheck from "./TaskCanceledCheck.vue";
import Empty from "./Empty.vue";
import { toRefs, onMounted, onUpdated } from "vue";
import { partition, snakeCase } from "lodash";
import { addAction, applyFilters, doAction } from "@wordpress/hooks";
import { VueDraggableNext } from "vue-draggable-next";
import EditableText from "./EditableText.vue";
import TaskMenu from "./TaskMenu.vue";

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
          put: (item1, item2) => {
            if (item1.options.group.name !== item2.options.group.name) {
              return false;
            }
            return maxTasks ? modelValue.length < maxTasks : true;
          },
        }"
      >
        <div
          class="py-4 px-4 border-l-4 group print:border-none transition-all"
          v-for="(task, taskIndex) in modelValue"
          v-touch:longtap="() => emit('task:picked', task, group)"
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
          <div class="flex items-center text-sm w-full">
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
            <EditableText
              :id="`task-name-${group.id}-${task.id}`"
              class="font-normal flex-grow text-gray-700 bg-transparent focus:border-none focus:outline-none mr-2"
              v-model="task.title"
              :class="[
                task.done || task?.canceled ? 'line-through opacity-50' : '',
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
            <div class="text-sm flex flex-shrink items-center gap-2">
              <span
                class="flex items-center mx-1"
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
              <!-- Task Menu -->
              <TaskMenu />
            </div>
          </div>
        </div>
      </VueDraggableNext>
    </div>
  </div>
</template>
