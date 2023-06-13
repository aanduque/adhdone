<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import {
  BoltIcon,
  Cog6ToothIcon,
  TagIcon,
  PlusCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SunIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";
import { useStore } from "vuex";
import { computed, inject } from "vue";
import download from "in-browser-download";
import moment from "moment";

const user = inject("user", null);

const { commit, state } = useStore();

const data = computed(() => state);

defineProps({
  group: null,
});

/**
 * The menu actions that can be performed on a group.
 */
const menuActions = [
  {
    name: "Start new day",
    tooltip: null,
    action: () => {
      commit("addNewGroup");
    },
    icon: SunIcon,
    primary: true,
  },
  {
    name: "Create new Task",
    tooltip: null,
    action: () => {
      commit("addNewGroup");
    },
    icon: CheckCircleIcon,
    separator: true,
  },
  {
    name: "Create new Group",
    tooltip: null,
    action: () => {
      commit("addNewGroup");
    },
    icon: PlusCircleIcon,
  },
  {
    name: "Settings",
    tooltip: "Manage your settings for this app.",
    action: () => {
      commit("openSettingsScreen", "general", {});
    },
    icon: Cog6ToothIcon,
    separator: true,
  },
  {
    name: "Categories",
    tooltip: "Manage your categories.",
    action: () => {
      commit("openSettingsScreen", "categories", {});
    },
    icon: TagIcon,
    separator: true,
  },
  {
    name: "Integrations",
    tooltip: "Manage your integrations.",
    action: () => {
      commit("openSettingsScreen", "integrations", {});
    },
    icon: BoltIcon,
  },
  {
    name: "Import",
    tooltip: "Import your groups and tasks from a JSON string.",
    action: () => {
      commit("openSettingsScreen", "integrations", {});
    },
    icon: ArrowUpIcon,
    separator: true,
  },
  {
    name: "Export",
    tooltip: "Download the current state as a JSON file.",
    action: () => {
      const exportFileName = moment().format("YYYY-MM-DD");
      download(JSON.stringify(data.value), `${exportFileName}.tasks.json`);
    },
    icon: ArrowDownIcon,
  },
];
</script>

<template>
  <Menu as="div" class="relative inline-block text-left ml-4">
    <div>
      <MenuButton
        v-tooltip="'Group settings'"
        class="items-center rounded-full bg-transparent p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 group-hover:flex"
      >
        <span class="sr-only">Open options</span>
        <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-0 z-20 mt-2 w-60 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="py-1">
          <MenuItem
            v-slot="{ active }"
            :key="menuAction.name"
            v-for="menuAction in menuActions"
            v-tooltip="menuAction.tooltip"
            as="div"
            :class="[
              menuAction.separator
                ? 'border-t border-gray-100 mt-1 pt-1 block'
                : '',
              menuAction.primary ?? false ? '-mt-1 -mb-1' : '',
            ]"
          >
            <a
              @click="() => menuAction.action(group)"
              href="#"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'group flex items-center px-4 py-2 text-sm',
                menuAction.delete ?? false ? 'text-red-700' : '',
                menuAction.primary ?? false
                  ? 'bg-indigo-700 py-4 text-white rounded-tl rounded-tr shadow hover:scale-110 hover:shadow-lg transition duration-200 ease-in-out hover:rounded z-20'
                  : '',
              ]"
            >
              <component
                :is="menuAction.icon"
                class="mr-3 h-5 w-5"
                :class="[
                  menuAction.delete ?? false
                    ? 'text-red-700'
                    : 'text-gray-400 group-hover:text-gray-500',
                  menuAction.primary ?? false
                    ? 'text-white group-hover:text-white'
                    : '',
                ]"
                aria-hidden="true"
              />
              {{ menuAction.name }}
            </a>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
