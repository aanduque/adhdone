<script setup lang="ts">
import { getView, views as getViews } from "@/app/views";
import { computed } from "vue";
import { useStore } from "vuex";
import ActionMenu from "./ActionMenu.vue";

const { commit, state } = useStore();

const currentView = computed(() => state.currentView);

const views = getViews();

const view = computed(() => getView(currentView.value));
</script>

<template>
  <div class="mx-4 lg:mx-auto flex flex-col items-center">
    <div class="flex items-center">
      <div
        class="container p-6 sm:px-6 lg:px-8 items-center justify-center flex-grow"
      >
        <div class="">
          <nav class="flex justify-center" aria-label="Tabs">
            <a
              v-for="tab in views"
              href="#"
              :key="tab.name"
              @click.prevent="() => commit('switchView', tab.id)"
              :class="[
                currentView === tab.id
                  ? 'border-gray-200 bg-gray-50 text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 border-transparent',
                'flex items-center px-3 py-2 font-medium text-sm rounded-md group border transition ease-in-out duration-150',
              ]"
              :aria-current="currentView === tab.id ? 'page' : undefined"
            >
              <component :is="tab.icon" class="h-4 w-4" />
              <span
                :class="[
                  currentView === tab.id ? '' : 'text-[0px] opacity-0 scale-0',
                  'ml-2 transition ease-in-out duration-150',
                ]"
                >{{ tab.name }}</span
              >
              <span
                v-if="tab.count"
                class="inline-flex items-center gap-x-1.5 rounded-full bg-pink-100 px-1.5 py-0.5 text-xs font-medium text-pink-700 ml-2"
              >
                {{ tab.count }}
              </span>
            </a>
          </nav>
        </div>
        <slot />
      </div>
    </div>

    <component :is="view.component" />
  </div>
</template>
