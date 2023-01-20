<script setup lang="ts">
import { toRefs, ref, watchEffect, defineEmits } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  Cog6ToothIcon,
  Cog8ToothIcon,
  ExclamationTriangleIcon,
  TagIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Switch,
  SwitchDescription,
  SwitchGroup,
  SwitchLabel,
} from "@headlessui/vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/20/solid";
import {
  Bars3Icon,
  BellIcon,
  CogIcon,
  CreditCardIcon,
  KeyIcon,
  SquaresPlusIcon,
  UserCircleIcon,
} from "@heroicons/vue/24/outline";

const activeTab = ref("general");

const isTabActive = (tabId) => activeTab.value === tabId;

const subNavigation = [
  {
    id: "general",
    name: "General",
    href: "#",
    icon: Cog8ToothIcon,
  },
  {
    id: "categories",
    name: "Categories",
    href: "#",
    icon: TagIcon,
  },
];

const props = defineProps<{
  modelValue: Record<string, any>;
  categories?: Record<string, any>;
  open: boolean;
}>();

const settings = toRefs(props).modelValue;
const categories = toRefs(props).categories;

const emit = defineEmits(["update:modelValue", "close", "update:categories"]);

watchEffect(() => {
  // console.log("MUDOU");
  emit("update:modelValue", settings);
  emit("update:categories", categories);
});

// lang: "pt-br",
// maxGroups: 3,
// maxTasksPerGroup: 5,
// maxRoundsPerTask: 3,
// pomodoroLength: 25,
// maxSkips: 3,
</script>

<template>
  <div>
    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-10" @close="() => emit('close')">
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
                  sm:my-8 sm:w-full sm:max-w-3xl
                "
              >
                <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    class="
                      rounded-md
                      bg-white
                      text-gray-400
                      hover:text-gray-500
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500
                      focus:ring-offset-2
                      z-10
                    "
                    @click="open = false"
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
                        class="
                          text-lg
                          font-medium
                          leading-6
                          bg-white
                          text-gray-900
                          px-4
                          py-5
                          flex
                          items-center
                          border-b border-gray-200
                        "
                      >
                        <!-- <Cog6ToothIcon class="w-6 h-6 text-gray-600 mr-2" /> -->
                        Settings
                      </DialogTitle>
                      <div id="settings-content" class="">
                        <div class="mx-auto">
                          <div
                            class="overflow-hidden rounded-lg bg-white shadow"
                          >
                            <div
                              class="
                                divide-y divide-gray-200
                                lg:grid
                                lg:grid-cols-12
                                lg:divide-y-0
                                lg:divide-x
                              "
                            >
                              <aside class="py-6 lg:col-span-3 bg-gray-50">
                                <nav class="space-y-1">
                                  <a
                                    v-for="item in subNavigation"
                                    :key="item.name"
                                    @click.prevent="activeTab = item.id"
                                    href="#"
                                    :class="[
                                      isTabActive(item.id)
                                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-700'
                                        : 'border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900',
                                      'group border-l-4 px-3 py-2 flex items-center text-sm font-medium',
                                    ]"
                                    :aria-current="
                                      isTabActive(item.id) ? 'page' : undefined
                                    "
                                  >
                                    <component
                                      :is="item.icon"
                                      :class="[
                                        isTabActive(item.id)
                                          ? 'text-indigo-500 group-hover:text-indigo-500'
                                          : 'text-gray-400 group-hover:text-gray-500',
                                        'flex-shrink-0 -ml-1 mr-3 h-6 w-6',
                                      ]"
                                      aria-hidden="true"
                                    />
                                    <span class="truncate">{{
                                      item.name
                                    }}</span>
                                  </a>
                                </nav>
                              </aside>

                              <form
                                v-auto-animate
                                class="divide-y divide-gray-200 lg:col-span-9"
                                action="#"
                                method="POST"
                              >
                                <!-- Profile section -->
                                <div
                                  class="py-6 px-4 sm:p-6 lg:pb-8"
                                  v-if="isTabActive('general')"
                                >
                                  <div>
                                    <h2
                                      class="
                                        text-lg
                                        font-medium
                                        leading-6
                                        text-gray-900
                                      "
                                    >
                                      Profile
                                    </h2>
                                    <p class="mt-1 text-sm text-gray-500">
                                      This information will be displayed
                                      publicly so be careful what you share.
                                    </p>
                                  </div>

                                  <div class="mt-6 flex flex-col lg:flex-row">
                                    <div class="flex-grow space-y-6">
                                      <div>
                                        <label
                                          for="pomodoro-length"
                                          class="
                                            block
                                            text-sm
                                            font-medium
                                            text-gray-700
                                          "
                                          >Pomodoro Length</label
                                        >
                                        <div
                                          class="mt-1 flex rounded-md shadow-sm"
                                        >
                                          <input
                                            type="number"
                                            name="pomodoro-length"
                                            id="pomodoro-length"
                                            v-model="settings.pomodoroLength"
                                            class="
                                              block
                                              w-full
                                              min-w-0
                                              flex-grow
                                              rounded-none rounded-l-md
                                              border-gray-300
                                              focus:border-sky-500
                                              focus:ring-sky-500
                                              sm:text-sm
                                            "
                                          />
                                          <span
                                            class="
                                              inline-flex
                                              items-center
                                              rounded-r-md
                                              border border-l-0 border-gray-300
                                              bg-gray-50
                                              px-3
                                              text-gray-500
                                              sm:text-sm
                                            "
                                            >min</span
                                          >
                                        </div>
                                        <p class="mt-2 text-sm text-gray-500">
                                          The length, in minutes, of a work
                                          session.
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div class="mt-6 grid grid-cols-12 gap-6">
                                    <div class="col-span-12">
                                      <label
                                        for="max-active-groups"
                                        class="
                                          block
                                          text-sm
                                          font-medium
                                          text-gray-700
                                        "
                                        >Max Tasks per Group</label
                                      >
                                      <input
                                        type="number"
                                        name="max-tasks-per-group"
                                        id="max-tasks-per-group"
                                        v-model="settings.maxTasksPerGroup"
                                        class="
                                          mt-1
                                          block
                                          w-full
                                          rounded-md
                                          border border-gray-300
                                          py-2
                                          px-3
                                          shadow-sm
                                          focus:border-sky-500
                                          focus:outline-none
                                          focus:ring-sky-500
                                          sm:text-sm
                                        "
                                      />
                                      <p class="mt-2 text-sm text-gray-500">
                                        The length, in minutes, of a work
                                        session.
                                      </p>
                                    </div>
                                  </div>

                                  <div class="mt-6 grid grid-cols-12 gap-6">
                                    <div class="col-span-12">
                                      <label
                                        for="max-rounds-per-task"
                                        class="
                                          block
                                          text-sm
                                          font-medium
                                          text-gray-700
                                        "
                                        >Max Rounds per Task</label
                                      >
                                      <input
                                        type="number"
                                        name="max-rounds-per-task"
                                        id="max-rounds-per-task"
                                        v-model="settings.maxRoundsPerTask"
                                        class="
                                          mt-1
                                          block
                                          w-full
                                          rounded-md
                                          border border-gray-300
                                          py-2
                                          px-3
                                          shadow-sm
                                          focus:border-sky-500
                                          focus:outline-none
                                          focus:ring-sky-500
                                          sm:text-sm
                                        "
                                      />
                                      <p class="mt-2 text-sm text-gray-500">
                                        The length, in minutes, of a work
                                        session.
                                      </p>
                                    </div>
                                  </div>

                                  <div class="mt-6 grid grid-cols-12 gap-6">
                                    <div class="col-span-12">
                                      <label
                                        for="max-skips"
                                        class="
                                          block
                                          text-sm
                                          font-medium
                                          text-gray-700
                                        "
                                        >Allowed Skips</label
                                      >
                                      <input
                                        type="number"
                                        name="max-skips"
                                        id="max-skips"
                                        v-model="settings.maxSkips"
                                        class="
                                          mt-1
                                          block
                                          w-full
                                          rounded-md
                                          border border-gray-300
                                          py-2
                                          px-3
                                          shadow-sm
                                          focus:border-sky-500
                                          focus:outline-none
                                          focus:ring-sky-500
                                          sm:text-sm
                                        "
                                      />
                                      <p class="mt-2 text-sm text-gray-500">
                                        The length, in minutes, of a work
                                        session.
                                      </p>
                                    </div>
                                  </div>
                                  <div class="mt-6 grid grid-cols-12 gap-6">
                                    <div class="col-span-12">
                                      <label
                                        for="max-active-groups"
                                        class="
                                          block
                                          text-sm
                                          font-medium
                                          text-gray-700
                                        "
                                        >Max Active Groups</label
                                      >
                                      <input
                                        type="number"
                                        name="max-active-groups"
                                        id="max-active-groups"
                                        v-model="settings.maxGroups"
                                        class="
                                          mt-1
                                          block
                                          w-full
                                          rounded-md
                                          border border-gray-300
                                          py-2
                                          px-3
                                          shadow-sm
                                          focus:border-sky-500
                                          focus:outline-none
                                          focus:ring-sky-500
                                          sm:text-sm
                                        "
                                      />
                                      <p class="mt-2 text-sm text-gray-500">
                                        The length, in minutes, of a work
                                        session.
                                      </p>
                                    </div>
                                  </div>

                                  <div class="mt-6 grid grid-cols-12 gap-6">
                                    <div class="col-span-12">
                                      <label
                                        for="max-active-groups"
                                        class="
                                          block
                                          text-sm
                                          font-medium
                                          text-gray-700
                                        "
                                        >Linear API</label
                                      >
                                      <input
                                        type="text"
                                        name="max-tasks-per-group"
                                        id="max-tasks-per-group"
                                        v-model="settings.linearApiKey"
                                        class="
                                          mt-1
                                          block
                                          w-full
                                          rounded-md
                                          border border-gray-300
                                          py-2
                                          px-3
                                          shadow-sm
                                          focus:border-sky-500
                                          focus:outline-none
                                          focus:ring-sky-500
                                          sm:text-sm
                                        "
                                      />
                                      <p class="mt-2 text-sm text-gray-500">
                                        The length, in minutes, of a work
                                        session.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  class="py-6 px-4 sm:p-6 lg:pb-8"
                                  v-if="isTabActive('categories')"
                                >
                                  <div>
                                    <h2
                                      class="
                                        text-lg
                                        font-medium
                                        leading-6
                                        text-gray-900
                                      "
                                    >
                                      Categories
                                    </h2>
                                    <p class="mt-1 text-sm text-gray-500">
                                      This information will be displayed
                                      publicly so be careful what you share.
                                    </p>
                                  </div>

                                  <div class="mt-6 grid grid-cols-12 gap-6">
                                    <div class="col-span-12" v-auto-animate>
                                      <!-- <label
                                        for="max-active-groups"
                                        class="
                                          block
                                          text-sm
                                          font-medium
                                          text-gray-700
                                        "
                                        >Categories</label
                                      > -->
                                      <div
                                        class="mt-1 flex rounded-md shadow-sm"
                                        v-for="(category, index) in categories"
                                      >
                                        <div
                                          class="
                                            relative
                                            flex flex-grow
                                            items-stretch
                                            focus-within:z-10
                                          "
                                        >
                                          <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            v-model="category.name"
                                            class="
                                              block
                                              w-full
                                              rounded-none rounded-l-md
                                              border-gray-300
                                              focus:border-indigo-500
                                              focus:ring-indigo-500
                                              sm:text-sm
                                            "
                                            placeholder="Category name"
                                          />
                                        </div>
                                        <div
                                          type="button"
                                          class="
                                            relative
                                            -ml-px
                                            inline-flex
                                            items-center
                                            space-x-2
                                            rounded-r-md
                                            border border-gray-300
                                            bg-gray-50
                                            px-3
                                            py-0
                                            text-sm
                                            font-medium
                                            text-gray-700
                                            hover:bg-gray-100
                                            focus:border-indigo-500
                                            focus:outline-none
                                            focus:ring-1
                                            focus:ring-indigo-500
                                          "
                                        >
                                          <label>
                                            <span
                                              class="
                                                inline-block
                                                h-3
                                                w-3
                                                rounded-full
                                              "
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
                                        class="
                                          mt-2
                                          inline-flex
                                          items-center
                                          rounded
                                          border border-gray-300
                                          bg-white
                                          px-2.5
                                          py-1.5
                                          text-xs
                                          font-medium
                                          text-gray-700
                                          shadow-sm
                                          hover:bg-gray-50
                                          focus:outline-none
                                          focus:ring-2
                                          focus:ring-indigo-500
                                          focus:ring-offset-2
                                        "
                                        @click.prevent="
                                          () =>
                                            categories.push({
                                              name: '',
                                              color: `#${Math.floor(
                                                Math.random() * 16777215
                                              ).toString(16)}`,
                                            })
                                        "
                                      >
                                        Add Category
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="
                    bg-gray-50
                    px-4
                    py-3
                    sm:flex sm:flex-row-reverse sm:px-6
                    border-t border-gray-200
                  "
                >
                  <button
                    type="button"
                    class="
                      inline-flex
                      w-full
                      justify-center
                      rounded-md
                      border border-transparent
                      bg-red-600
                      px-4
                      py-2
                      text-base
                      font-medium
                      text-white
                      shadow-sm
                      hover:bg-red-700
                      focus:outline-none
                      focus:ring-2
                      focus:ring-red-500
                      focus:ring-offset-2
                      sm:ml-3 sm:w-auto sm:text-sm
                    "
                    @click="open = false"
                  >
                    Deactivate
                  </button>
                  <button
                    type="button"
                    class="
                      mt-3
                      inline-flex
                      w-full
                      justify-center
                      rounded-md
                      border border-gray-300
                      bg-white
                      px-4
                      py-2
                      text-base
                      font-medium
                      text-gray-700
                      shadow-sm
                      hover:bg-gray-50
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500
                      focus:ring-offset-2
                      sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm
                    "
                    @click="open = false"
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
