<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const categories = computed({
  get: () => store.state.categories,
  set: (categories) => store.commit("setCategories", categories),
});
</script>

<template>
  <form
    v-auto-animate
    class="divide-y divide-gray-200 lg:col-span-9"
    action="#"
  >
    <div class="p-6">
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12" v-auto-animate>
          <div
            class="mt-1 flex rounded-md shadow-sm"
            :key="index"
            v-for="(category, index) in categories"
          >
            <div
              class="relative flex flex-grow items-stretch focus-within:z-10"
            >
              <input
                type="text"
                v-model.lazy="category.name"
                @keydown.delete="
                  (e) => {
                    if (e?.target?.value?.length === 0) {
                      e.preventDefault();
                      categories.splice(index, 1);
                    }
                  }
                "
                class="block w-full rounded-none rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Category name"
              />
            </div>
            <div
              type="button"
              class="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-3 py-0 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <label>
                <span
                  class="inline-block h-3 w-3 rounded-full"
                  :style="{
                    backgroundColor: category.color,
                  }"
                  >&nbsp;</span
                >
                <input
                  v-model="category.color"
                  type="color"
                  class="w-0 opacity-0"
                />
              </label>
            </div>
          </div>
          <button
            type="button"
            class="mt-2 inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click.prevent="
              () =>
                categories.push({
                  id: Math.random().toString(36).slice(2, 9),
                  name: '',
                  color: `#${Math.floor(Math.random() * 16777215).toString(
                    16
                  )}`,
                })
            "
          >
            Add Category
          </button>
        </div>
      </div>
    </div>
  </form>
</template>
