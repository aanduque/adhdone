<script setup lang="ts">
import { CheckIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { toRefs, defineEmits } from "vue";
</script>
<template>
  <div class="flex items-center opacity-40">
    <div class="pretty p-icon p-round p-smooth p-thick">
      <input type="checkbox" :checked="true" />
      <div class="state">
        <XMarkIcon class="icon" aria-hidden="true" />
        <label> </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "pretty-checkbox";
</style>