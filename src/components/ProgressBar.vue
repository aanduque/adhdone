<script setup lang="ts">
import { CheckIcon } from "@heroicons/vue/24/outline";
import { computed } from "vue";
const props = defineProps<{
  total: number;
  completed: number;
}>();

const percentage = computed(() => {
  return (props.completed / props.total) * 100;
});
</script>

<template>
  <div
    class="
      relative
      w-full
      h-1
      group
      hover:h-7
      bg-gray-600
      transition-all
      print:hidden
    "
  >
    <div
      v-if="total > 0"
      class="absolute inset-y-0 left-0 bg-green-400 transition-all h-7"
      :style="{ width: `${percentage}%` }"
    >
      <div class="relative h-7">
        <div
          class="hidden group-hover:flex justify-end items-center h-7"
          v-if="completed"
        >
          <span class="text-xs flex items-center px-3 h-7 m-0 truncate">
            <CheckIcon class="h-3 w-3 mr-1" aria-hidden="true" />
            {{ completed }} of {{ total }} completed
            <span v-if="completed >= 0.3 * total">- Good Job 🎉</span></span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
