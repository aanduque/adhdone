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
      p-4
      text-center
      items-center
      justify-center
    "
  >
    <CheckCircleIcon class="mx-auto h-8 w-8 text-gray-300" />
    <h3 class="mt-2 text-sm font-medium text-gray-400">{{ title }}</h3>
    <p class="mt-1 text-sm text-gray-400">
      {{ description }}
    </p>
    <div class="mt-6" v-if="Boolean(slots.default)">
      <slot></slot>
    </div>
  </div>
</template>