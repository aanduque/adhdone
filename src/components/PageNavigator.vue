<script setup lang="ts">
import { getView, views as getViews } from "@/app";
import { computed } from "vue";
import { useStore } from "vuex";

const { commit, state } = useStore();

const currentView = computed(() => state.currentView);

const views = getViews();

const view = computed(() => getView(currentView.value));
</script>

<template>
  <div>
    <div
      class="container p-6 sm:px-6 lg:px-8 flex items-center mx-auto justify-between sm:justify-center"
    >
      <div class="">
        <nav class="flex justify-center space-x-4" aria-label="Tabs">
          <a
            v-for="tab in views"
            href="#"
            :key="tab.name"
            @click.prevent="() => commit('switchView', tab.id)"
            :class="[
              currentView === tab.id
                ? 'border-gray-200 bg-gray-50 text-gray-800 shadow-sm'
                : 'text-gray-600 hover:text-gray-800 border-transparent',
              'flex items-center px-3 py-2 font-medium text-sm rounded-md group border',
            ]"
            :aria-current="currentView === tab.id ? 'page' : undefined"
          >
            <component :is="tab.icon" class="h-4 w-4" />
            <span
              :class="currentView === tab.id ? '' : 'hidden sm:block'"
              class="ml-2"
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

    <component :is="view.component" />
  </div>
</template>
