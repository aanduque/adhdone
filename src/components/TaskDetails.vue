<script setup lang="ts">
import {
  computed,
  ref,
  toRefs,
  watchEffect,
  defineEmits,
  defineProps,
  nextTick,
} from "vue";
import { markdown } from "markdown";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { CheckIcon } from "@heroicons/vue/24/outline";
import { isNull } from "lodash";
import TaskCheck from "./TaskCheck.vue";

const props = defineProps<{
  modelValue?: Record<string, any>;
}>();

const md = (content) => markdown.toHTML(content);

const current = toRefs(props).modelValue;

const open = computed(() => Boolean(current.value.task));

const editingDescription = ref(false);

const emit = defineEmits(["update:modelValue"]);

const focusDescField = () => {
  document.getElementById("description")?.focus();
};

watchEffect(() => {
  emit("update:modelValue", current);
});
const tabs = [
  { name: "Description", href: "#", current: true },
  { name: "Sessions", href: "#", current: false },
];
</script>
<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-10" @close="() => (current.task = null)">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="
            flex
            min-h-full
            items-end
            justify-center
            p-4
            text-center
            sm:items-center sm:p-0
          "
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="
                relative
                transform
                overflow-hidden
                rounded-lg
                bg-white
                text-left
                shadow-xl
                transition-all
                sm:my-8 sm:w-full sm:max-w-5xl
              "
            >
              <div class="col-span-12 grid grid-cols-12">
                <!-- Main -->
                <div class="col-span-9 flex flex-col justify-between space-y-8">
                  <!-- Header -->
                  <div
                    class="
                      shadow-sm
                      md:flex md:items-center md:justify-between
                      px-8
                      py-6
                    "
                  >
                    <div class="min-w-0 flex-1">
                      <input
                        class="
                          text-xl
                          font-bold
                          w-full
                          leading-7
                          text-gray-900
                          sm:truncate sm:text-2xl sm:tracking-tight
                          focus:outline-none
                        "
                        v-model.lazy="current.task.title"
                        placeholder="Task"
                      />
                    </div>
                    <div class="mt-4 flex md:mt-0 md:ml-4">
                      <button
                        type="button"
                        class="
                          inline-flex
                          items-center
                          rounded-md
                          border border-gray-300
                          bg-white
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-gray-700
                          shadow-sm
                          hover:bg-gray-50
                          focus:outline-none
                          focus:ring-2
                          focus:ring-indigo-500
                          focus:ring-offset-2
                        "
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        class="
                          ml-3
                          inline-flex
                          items-center
                          rounded-md
                          border border-transparent
                          bg-indigo-600
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-white
                          shadow-sm
                          hover:bg-indigo-700
                          focus:outline-none
                          focus:ring-2
                          focus:ring-indigo-500
                          focus:ring-offset-2
                        "
                      >
                        Publish
                      </button>
                    </div>
                  </div>
                  <!-- End Header -->
                  <!-- Description -->
                  <!-- Tabs -->
                  <div class="hidden px-8">
                    <div class="sm:hidden">
                      <label for="tabs" class="sr-only">Select a tab</label>
                      <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
                      <select
                        id="tabs"
                        name="tabs"
                        class="
                          block
                          w-full
                          rounded-md
                          border-gray-300
                          focus:border-indigo-500 focus:ring-indigo-500
                        "
                      >
                        <option
                          v-for="tab in tabs"
                          :key="tab.name"
                          :selected="tab.current"
                        >
                          {{ tab.name }}
                        </option>
                      </select>
                    </div>
                    <div class="hidden sm:block">
                      <nav class="flex space-x-4" aria-label="Tabs">
                        <a
                          v-for="tab in tabs"
                          :key="tab.name"
                          :href="tab.href"
                          :class="[
                            tab.current
                              ? 'bg-gray-100 text-gray-700'
                              : 'text-gray-500 hover:text-gray-700',
                            'px-3 py-2 font-medium text-sm rounded-md',
                          ]"
                          :aria-current="tab.current ? 'page' : undefined"
                          >{{ tab.name }}</a
                        >
                      </nav>
                    </div>
                  </div>
                  <!-- End Tabs -->
                  <div class="flex flex-col px-8 pb-8">
                    <div
                      v-if="!editingDescription"
                      class="prose prose-indigo text-gray-500"
                      @dblclick="
                        () => {
                          editingDescription = true;
                          nextTick(() => {
                            focusDescField();
                          });
                        }
                      "
                      v-html="
                        current.task.description
                          ? md(current.task.description)
                          : 'Double click to edit.'
                      "
                    ></div>
                    <div v-if="editingDescription">
                      <textarea
                        id="description"
                        v-model="current.task.description"
                        @blur="() => (editingDescription = false)"
                        class="
                          h-48
                          w-full
                          m-0
                          flex-1
                          border-0
                          p-0
                          text-gray-500
                        "
                        placeholder="No description"
                        >{{ current.task.description }}</textarea
                      >
                    </div>
                  </div>
                  <!-- End Description -->
                </div>
                <!-- End Main -->
                <!-- Sidebar -->
                <div class="col-span-3 border-l border-gray-200 bg-gray-50 p-8">
                  Sidebar
                </div>
                <!-- End Sidebar -->
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
