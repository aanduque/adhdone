<script setup lang="ts">
import { CheckIcon } from "@heroicons/vue/24/outline";
import { toRefs, defineEmits, watch } from "vue";

const props = defineProps<{
  modelValue: boolean;
}>();

const checked = toRefs(props).modelValue;

watch(checked, (value) => emit("change", value));

const emit = defineEmits(["update:modelValue", "change"]);
</script>
<template>
  <div class="flex items-center">
    <div class="pretty p-icon p-round p-thick">
      <input
        type="checkbox"
        :checked="checked"
        @input="emit('update:modelValue', $event.target.checked)"
      />
      <div class="state p-success-o">
        <CheckIcon class="icon" aria-hidden="true" />
        <label> </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "pretty-checkbox";
</style>