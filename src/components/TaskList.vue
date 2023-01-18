<script setup lang="ts">
import { CheckIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import TaskCheck from "./TaskCheck.vue";
import TaskCanceledCheck from "./TaskCanceledCheck.vue";
import Empty from "./Empty.vue";
import { toRefs, defineEmits, onMounted, onUpdated } from "vue";
import { filter, partition, remove, snakeCase, isNull } from "lodash";
import { applyFilters } from "@wordpress/hooks";
import { VueDraggableNext } from "vue-draggable-next";

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

const emit = defineEmits([
  "update:modelValue",
  "task:dblclick",
  "task:delete",
  "list:overflow",
  "task:mouseover",
  "task:create",
  "task:done",
  "task:undone",
  "task:canceled",
]);

const checkOverflow = () => {
  if (maxTasks?.value && modelValue.value.length > maxTasks?.value) {
    let index = 0;
    const blocks = partition(modelValue.value, (task) => {
      const keep = index < maxTasks.value!;
      index++;
      return keep;
    });
    console.log(blocks);
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
                } scale-[104%] shadow-md border border-gray-200 rounded-md transition-transform z-10`
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
            <TaskCanceledCheck v-else />

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
                  :class="[
                    task.done || task?.canceled
                      ? 'line-through opacity-50'
                      : '',
                  ]"
                  v-model="task.title"
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
                class="flex items-center text-xs text-gray-600"
              >
                <XMarkIcon class="h-2 w-2" />
                <span class="top-[-1px]">{{ task.counter }}</span>
              </span>
            </div>
          </div>
        </div>
      </VueDraggableNext>
    </div>
  </div>
</template>
