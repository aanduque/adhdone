<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
import ActionMenu from "./ActionMenu.vue";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { CheckCircleIcon, PlusCircleIcon } from "@heroicons/vue/24/outline";

const store = useStore();
const pageTitle = computed(() => store.state.pageTitle);
const date = ref(null);
</script>

<template>
  <header class="bg-white shadow-sm print:hidden">
    <div class="container mx-auto p-4 sm:px-6 lg:px-8">
      <div class="items-center flex justify-between">
        <div class="flex min-w-0 flex-1 items-center py-2">
          <input
            class="w-full text-lg font-medium leading-7 text-gray-900 focus:outline-none sm:truncate sm:text-xl sm:tracking-tight lg:text-2xl"
            :size="pageTitle.length ? pageTitle.length - 4 : 20"
            v-model="pageTitle"
          />
        </div>
        <div>
          <button
            type="button"
            class="hidden md:inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-4 py-3 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusCircleIcon class="-ml-0.5 h-5 w-5" aria-hidden="true" />
            <span class="hidden md:block font-semibold">Add Task</span>
          </button>
          <ActionMenu class="justify-self-end" />
        </div>
      </div>
    </div>
  </header>
</template>

<style>
.flatpickr-input {
  /* display: none; */
}
</style>
