<script setup lang="ts">
import {
  XMarkIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  PlayIcon,
  ForwardIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";
import imgBgUrl from "@/assets/groups-bg.png";
import moment from "moment";
import momentDurationFormat from "moment-duration-format";
import { computed, ref } from "vue";
import { markdown } from "markdown";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { clone, snakeCase } from "lodash";
import { applyFilters } from "@wordpress/hooks";

const md = (content) => markdown.toHTML(content);

const emit = defineEmits([
  "task:pick",
  "task:start",
  "task:completeAndNext",
  "close",
  "toggleFullScreen",
]);

const props = defineProps<{
  open: boolean;
  task: any;
  fullScreen?: boolean;
  session?: any;
  elapsedTime?: any;
  categories?: any;
}>();

momentDurationFormat(moment);

const additionalElements = computed(() => {
  return applyFilters("active.task.extra", "", props.task, props.session);
});

const getCategory = (categoryId: string) => {
  const categoriesList = clone(props.categories)

  categoriesList.push({
    name: 'Group',
    color: "#333333",
  })

  return (
    categoriesList.filter(
      (category) => snakeCase(category.name) === snakeCase(categoryId)
    )[0] ?? {
      name: "No category",
      color: "#f9f9f9",
    }
  );
};

const formatDuration = (duration) => {
  return moment.duration(duration, "seconds").format("h:mm:ss");
};
</script>

<template>
  <div>
    <div
      class="z-5 fixed flex flex-col justify-end print:hidden"
      v-auto-animate
      :class="
        task && (fullScreen ?? false)
          ? 'inset-0'
          : 'bottom-0 inset-x-0 mb-4 mx-4'
      "
    >
      <div class="flex justify-end">
        <button
          v-if="!task"
          v-tooltip.left="'Randomly pick task from active groups'"
          @click.prevent="emit('task:pick')"
          v-auto-animate
          type="button"
          class="inline-flex items-center rounded-full border border-transparent bg-indigo-600 p-4 text-white shadow-sm transition-all hover:scale-110 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <BoltIcon class="h-8 w-8" aria-hidden="true" />
          <span class="mx-2 hidden">Pick a Task</span>
        </button>
      </div>
    </div>
    <TransitionRoot as="template" :show="open && fullScreen">
      <Dialog as="div" class="relative z-30" @close="emit('close')">
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

        <div class="fixed inset-4 z-30">
          <div
            class="flex min-h-full flex-col justify-between text-center sm:items-center sm:p-0"
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
                class="relative flex flex-1 flex-col items-center justify-between overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-full"
              >
                <!-- Fullscreen Panel -->
                <div
                  class="absolute inset-0 bg-no-repeat opacity-10"
                  :style="`background-image: url(${imgBgUrl}); background-size: 600px; background-position: right 120%; z-index: 0; -webkit-filter: grayscale(100%); filter: grayscale(100%);`"
                >
                  &nbsp;
                </div>
                <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    @click="emit('close')"
                  >
                    <span class="sr-only">Minimize</span>
                    <ChevronDownIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div class="sm:flex sm:items-start"></div>
                <div class="mx-auto max-w-5xl px-6">
                  <div class="flex items-center divide-x">
                    <div
                      class="flex flex-col items-center justify-center text-center"
                      v-auto-animate
                    >
                      <div
                        v-if="session"
                        class="order-2 mt-0 -ml-8 inline-flex items-center gap-2 text-2xl text-black"
                      >
                        <ClockIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="font-mono font-medium">{{
                          formatDuration(elapsedTime)
                        }}</span>
                      </div>

                      <div
                        class="order-3 mb-1 flex items-center gap-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
                      >
                        <!-- <span class="text-3xl text-gray-500">Work on</span> -->
                        {{ task.title }}
                        <div
                          class="mt-2 mb-4 flex items-center gap-2 rounded-full text-4xl"
                        >
                          <!-- <span class="text-3xl text-gray-500">for</span> -->
                        </div>
                      </div>
                      <h2
                        :class="session ? 'order-6 opacity-0 -mt-4' : 'order-1 mt-4'"
                        class="text-lg font-semibold transition-all"
                        :style="`color: ${getCategory(task.category).color}`"
                      >
                        {{ getCategory(task.category).name }}
                      </h2>
                      <div
                        v-if="task.description"
                        v-html="
                          task.description
                            ? md(task.description)
                            : 'Time to get to work!'
                        "
                        :class="session ? 'order-5 mt-0' : 'order-3'"
                        class="task-md-content mx-auto max-h-96 max-w-xl text-base text-gray-500"
                      ></div>
                      <div
                        class="mt-4"
                        v-if="additionalElements"
                        v-html="additionalElements"
                      />
                    </div>
                  </div>
                </div>
                <div class="flex w-full">
                  <div
                    class="flex grow items-center justify-center gap-2 bg-indigo-600 p-4"
                  >
                    <button
                      v-if="task && !session"
                      @click.prevent="emit('task:start', task)"
                      class="group flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm transition-all hover:scale-110 hover:bg-indigo-50"
                    >
                      <PlayIcon
                        class="h-5 w-5 lg:mr-2 lg:-ml-1"
                        aria-hidden="true"
                      />
                      <span
                        class="hidden transition duration-200 ease-out lg:block"
                        >Start</span
                      >
                    </button>
                    <button
                      v-if="task && session"
                      @click.prevent="emit('task:completeAndNext', task)"
                      class="group flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm transition-all hover:scale-110 hover:bg-indigo-50"
                    >
                      <CheckCircleIcon
                        class="h-5 w-5 lg:mr-2 lg:-ml-1"
                        aria-hidden="true"
                      />
                      <span
                        class="hidden transition duration-200 ease-out lg:block"
                        >End Session</span
                      >
                    </button>
                    <button
                      v-if="task && !session"
                      :disabled="
                        !(task !== null && !task.jumped) || !remainingSkips
                      "
                      @click.prevent="jump"
                      type="button"
                      :class="
                        !(task !== null && !task.jumped) || !remainingSkips
                          ? 'opacity-50'
                          : ''
                      "
                      class="flex items-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <ForwardIcon
                        class="h-5 w-5 lg:mr-2 lg:-ml-1"
                        aria-hidden="true"
                      />
                      <span class="hidden lg:block">
                        {{
                          !(task !== null && !task.jumped)
                            ? "Already Skipped"
                            : remainingSkips
                            ? "Skip"
                            : "No skips left"
                        }}
                      </span>
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    <TransitionRoot as="template" :show="open && !fullScreen">
      <Dialog as="div" class="relative z-30" @close="emit('close')">
        <div class="fixed inset-x-0 bottom-0 z-30 mx-4 mb-4">
          <div
            class="flex min-h-full flex-col justify-between text-center sm:items-center sm:p-0"
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
                class="relative flex flex-1 flex-col items-center justify-between overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-full"
              >
                <div class="w-full bg-indigo-600" v-if="task">
                  <div class="mx-auto p-3 sm:px-6 lg:px-4">
                    <div class="flex flex-wrap items-center justify-between">
                      <!-- Item -->
                      <div class="flex w-0 flex-1 items-center" v-if="task">
                        <span
                          class="hidden rounded-lg bg-indigo-800 p-2 md:flex"
                          v-auto-animate
                        >
                          <ClockIcon
                            v-if="session"
                            class="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                          <CheckCircleIcon
                            v-else
                            class="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                          <span
                            v-if="session"
                            class="ml-1 mt-[1px] font-mono font-medium text-white"
                            >{{ formatDuration(elapsedTime) }}</span
                          >
                        </span>
                        <a
                          title="Enter focus mode"
                          v-tooltip="'Click to enter focus mode'"
                          href="#"
                          class="ml-3 flex gap-2 text-white"
                          @click.prevent="emit('toggleFullScreen')"
                        >
                          <span class="font-medium text-indigo-200">
                            {{ getCategory(task.category).name }}</span
                          >
                          <span class="text-indigo-200">•</span>
                          <span class="font-medium">{{ task.title }}</span>
                          <span
                            v-if="task.description"
                            class="hidden w-56 truncate text-indigo-200 md:inline"
                            >{{ task.description }}</span
                          >
                        </a>
                      </div>

                      <div class="flex w-0 flex-1 items-center" v-else>
                        <span class="flex rounded-lg bg-indigo-800 p-2">
                          <CheckCircleIcon
                            class="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </span>
                        <p class="ml-3 flex gap-2 truncate text-white">
                          <span class="font-medium">Let's get started!</span>
                        </p>
                      </div>

                      <div
                        class="order-3 mt-0 flex w-full shrink-0 gap-x-2 sm:order-2 sm:w-auto"
                      >
                        <slot></slot>
                      </div>
                      <div class="order-2 hidden shrink-0 sm:order-3 sm:ml-3">
                        <button
                          type="button"
                          @click="emit('close')"
                          class="-mr-1 flex rounded-md p-2 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2"
                        >
                          <span class="sr-only">Dismiss</span>
                          <XMarkIcon
                            class="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<style>
.task-md-content img {
  @apply my-4 rounded-lg shadow w-40 h-40 float-right ml-4 object-cover hidden;
}
.task-md-content p {
  @apply my-2;
}
</style>
