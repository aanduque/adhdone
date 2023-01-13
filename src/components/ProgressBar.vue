<script setup lang="ts">
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
      h-2
      group
      hover:h-6
      bg-gray-200
      transition-all
      print:hidden
    "
  >
    <div
      v-if="total > 0"
      class="absolute inset-y-0 left-0 bg-green-400"
      :style="{ width: `${percentage}%` }"
    ></div>
    <div class="absolute hidden group-hover:block right-0">
      <span class="text-xs mx-4 opacity-75"
        >{{ completed }} of {{ total }} completed</span
      >
    </div>
  </div>
</template>

<style scoped></style>
