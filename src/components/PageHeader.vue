<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
const store = useStore();
const pageTitle = computed(() => store.state.pageTitle);
</script>

<template>
  <header class="bg-white shadow-sm print:hidden">
    <div class="container mx-auto p-4 sm:px-6 lg:px-8">
      <div class="items-center md:flex md:justify-between">
        <div class="flex min-w-0 flex-1 items-center py-2">
          <input
            class="w-full text-lg font-medium leading-7 text-gray-900 focus:outline-none sm:truncate sm:text-xl sm:tracking-tight lg:text-2xl"
            :size="pageTitle.length ? pageTitle.length - 4 : 20"
            v-model="pageTitle"
          />
        </div>
      </div>
    </div>
  </header>
</template>
