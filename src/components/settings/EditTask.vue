<script setup lang="ts">
import { onMounted, toRefs, watchEffect } from "vue";
import Panel from "../Panel.vue";
import { LinkIcon } from "@heroicons/vue/20/solid";

import { markdown } from "markdown";

const md = (content: string) => markdown.toHTML(content);

const props = defineProps<{
  modelValue: Record<string, any>;
  open: boolean;
}>();

const task = toRefs(props).modelValue;

const emit = defineEmits(["update:modelValue", "close", "save"]);
watchEffect(() => {
  emit("update:modelValue", task);
});
onMounted(() => {});
</script>

<template>
  <Panel
    title="Task Details"
    description="Edit the task"
    :open="open"
    @close="emit('close')"
    @save="emit('save')"
    :backdrop="true"
    v-if="task"
  >
    <div class="divide-y divide-gray-200 px-4 sm:px-6">
      <div class="space-y-6 divide-y divide-gray-200 pt-6 pb-5">
        <div class="space-y-6">
          <div>
            <label
              for="task-title"
              class="block text-sm font-medium text-gray-900"
              >Task Name</label
            >
            <div class="mt-1">
              <input
                v-model="task.title"
                type="text"
                name="task-title"
                id="task-title"
                class="
                  block
                  w-full
                  rounded-md
                  border-gray-300
                  shadow-sm
                  focus:border-indigo-500 focus:ring-indigo-500
                  sm:text-sm
                "
              />
            </div>
          </div>
          <div>
            <label
              for="description"
              class="block text-sm font-medium text-gray-900"
              >Description</label
            >
            <div class="mt-1">
              <textarea
                v-model="task.description"
                id="description"
                name="description"
                rows="6"
                class="
                  block
                  w-full
                  rounded-md
                  border-gray-300
                  shadow-sm
                  focus:border-indigo-500 focus:ring-indigo-500
                  sm:text-sm
                "
              />
            </div>
            <p class="mt-2 text-sm text-gray-500" id="email-description">
              Markdown is supported.
            </p>
          </div>
          <div>
            <label for="url" class="block text-sm font-medium text-gray-700"
              >URL</label
            >
            <div class="relative mt-1 rounded-md shadow-sm">
              <div
                class="
                  pointer-events-none
                  absolute
                  z-10
                  inset-y-0
                  left-0
                  flex
                  items-center
                  pl-3
                "
              >
                <LinkIcon class="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                v-model="task.url"
                type="url"
                name="url"
                id="url"
                class="
                  block
                  w-full
                  rounded-md
                  border-gray-300
                  pl-9
                  focus:border-indigo-500 focus:ring-indigo-500
                  sm:text-sm
                "
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>
        <fieldset class="pt-4">
          <legend class="contents text-base font-medium text-gray-900">
            Description Preview
          </legend>
          <p class="text-sm text-gray-500">
            Here's how your description will show up.
          </p>
          <div class="mt-4 space-y-4">
            <div
              class="
                prose
                rounded-md
                bg-gray-50
                p-4
                text-sm
                border border-gray-200
              "
              v-html="md(task.description)"
            ></div>
          </div>
        </fieldset>
      </div>
    </div>
  </Panel>
</template>