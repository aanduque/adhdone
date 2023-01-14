<script setup lang="ts">
import { CheckCircleIcon } from "@heroicons/vue/24/outline";

defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <div
    class="
      text-center
      p-4
      border-2 border-dashed border-gray-200
      rounded-lg
      my-4
      flex-grow
    "
  >
    <CheckCircleIcon class="h-8 w-8 mx-auto text-gray-400" />
    <h3 class="mt-2 text-sm font-medium text-gray-900">{{ title }}</h3>
    <p class="mt-1 text-sm text-gray-500">
      {{ description }}
    </p>
    <div class="mt-6" v-if="slot">
      <slot></slot>
    </div>
  </div>
</template>