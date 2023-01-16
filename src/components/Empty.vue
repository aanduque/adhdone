<script setup lang="ts">
import { useSlots } from "vue";
import { CheckCircleIcon } from "@heroicons/vue/24/outline";

const slots = useSlots();

defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <div
    class="
      mt-4
      flex flex-grow flex-col
      rounded-lg
      border-2 border-dashed border-gray-200
      p-4
      text-center
      items-center
      justify-center
    "
  >
    <CheckCircleIcon class="h-8 w-8 mx-auto text-gray-400" />
    <h3 class="mt-2 text-sm font-medium text-gray-900">{{ title }}</h3>
    <p class="mt-1 text-sm text-gray-500">
      {{ description }}
    </p>
    <div class="mt-6" v-if="Boolean(slots.default)">
      <slot></slot>
    </div>
  </div>
</template>