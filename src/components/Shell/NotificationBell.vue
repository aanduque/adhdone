<script setup lang="ts">
import { BellIcon } from "@heroicons/vue/24/outline";
</script>

<template>
  <button
    type="button"
    class="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
  >
    <span class="sr-only">View notifications</span>
    <BellIcon class="h-6 w-6" aria-hidden="true" />
  </button>
</template>
