<script setup lang="ts">
import { XMarkIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";

defineProps<{
  task: any;
}>();
</script>

<template>
  <div
    class="fixed bottom-0 print:hidden"
    :class="task ? 'inset-x-0' : 'inset-x-0'"
  >
    <div class="bg-indigo-600 m-4 shadow-lg rounded-lg">
      <div class="mx-auto py-3 px-3 sm:px-6 lg:px-4">
        <div class="flex flex-wrap items-center justify-between">
          <!-- Item -->
          <div class="flex w-0 flex-1 items-center" v-if="task">
            <span class="flex rounded-lg bg-indigo-800 p-2">
              <CheckCircleIcon class="h-6 w-6 text-white" aria-hidden="true" />
            </span>
            <p class="ml-3 truncate text-white flex gap-2">
              <span class="font-medium">{{ task.title }}</span>
              <span
                v-if="task.description"
                class="hidden md:inline text-indigo-200"
                >{{ task.description }}</span
              >
            </p>
          </div>

          <div class="flex w-0 flex-1 items-center" v-else>
            <span class="flex rounded-lg bg-indigo-800 p-2">
              <CheckCircleIcon class="h-6 w-6 text-white" aria-hidden="true" />
            </span>
            <p class="ml-3 truncate text-white flex gap-2">
              <span class="font-medium">Let's get started!</span>
            </p>
          </div>

          <div
            class="
              order-3
              mt-2
              w-full
              flex-shrink-0 flex
              gap-x-2
              sm:order-2 sm:mt-0 sm:w-auto
            "
          >
            <slot></slot>
          </div>
          <div class="order-2 hidden flex-shrink-0 sm:order-3 sm:ml-3">
            <button
              type="button"
              @click="() => (open = false)"
              class="
                -mr-1
                flex
                rounded-md
                p-2
                hover:bg-indigo-500
                focus:outline-none focus:ring-2 focus:ring-white
                sm:-mr-2
              "
            >
              <span class="sr-only">Dismiss</span>
              <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
