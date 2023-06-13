<script setup lang="ts">
import { ref, computed, toRefs } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { getSettingsScreen } from "@/app/settings";
import { useStore } from "vuex";
import { toast } from "vue3-toastify";

const { state, commit } = useStore();

const settings = computed(() => state.uiState.settings ?? {});

const screen = computed(() => getSettingsScreen(settings.value.screenName));
</script>

<template>
  <div>
    <TransitionRoot as="template" :show="Boolean(settings.open ?? false)">
      <Dialog
        as="div"
        class="relative z-10"
        @close="() => commit('closeSettingsScreen')"
      >
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
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0 flex-grow"
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
                class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full flex-grow sm:max-w-2xl"
              >
                <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 z-10"
                    @click="() => commit('closeSettingsScreen')"
                  >
                    <span class="sr-only">Close</span>
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div class="">
                  <div class="">
                    <div class="sm:text-left">
                      <DialogTitle
                        as="h3"
                        class="text-lg font-medium leading-6 bg-white text-gray-900 px-4 py-5 flex items-center border-b border-gray-200"
                      >
                        <!-- <Cog6ToothIcon class="w-6 h-6 text-gray-600 mr-2" /> -->
                        {{ screen?.name ?? "Settings" }}
                      </DialogTitle>
                      <div id="settings-content" class="">
                        <div class="mx-auto">
                          <div
                            class="overflow-hidden rounded-lg bg-white shadow"
                          >
                            <component
                              :is="
                                screen?.component ? screen?.component : 'div'
                              "
                            />
                            <div
                              class="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200"
                >
                  <button
                    type="button"
                    class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    @click="
                      () => {
                        toast.success('Settings saved');
                        commit('closeSettingsScreen');
                      }
                    "
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    @click="() => commit('closeSettingsScreen')"
                    ref="cancelButtonRef"
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>
