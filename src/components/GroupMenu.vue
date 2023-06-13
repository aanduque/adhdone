<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import {
  TrashIcon,
  PlayCircleIcon,
  BoltIcon,
  EllipsisVerticalIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
  CheckIcon,
  CircleStackIcon,
  XMarkIcon,
  CalculatorIcon,
  ArrowsUpDownIcon,
  CalendarDaysIcon,
  ExclamationCircleIcon,
} from "@heroicons/vue/24/outline";
import { useStore } from "vuex";
import { toRefs } from "vue";
import { get, set } from "lodash";

const props = defineProps({
  group: null,
});

const { commit } = useStore();

const { group } = toRefs(props);

/**
 * Flags are boolean controllers for groups that can be
 * easily toggled on and off.
 */
const menuFlags = [
  {
    name: "Block until completed",
    tooltip: "If this block hides everything else once it appears.",
    icon: ExclamationCircleIcon,
    action: (group, event) => {
      event.preventDefault();
      const block = get(group, "settings.block", false);
      set(group, "settings.block", !block);
      commit("updateGroup", group);
    },
    active: (group) => get(group, "settings.block", false),
  },
  {
    name: "Show completed",
    tooltip: "Show completed tasks in this group",
    icon: CheckCircleIcon,
    action: (group, event) => {
      event.preventDefault();
      const showCompletedTasks = get(
        group,
        "settings.showCompletedTasks",
        true
      );
      set(group, "settings.showCompletedTasks", !showCompletedTasks);
      commit("updateGroup", group);
    },
    active: (group) => get(group, "settings.showCompletedTasks", true),
  },
  {
    name: "Show canceled",
    tooltip: "Show canceled tasks in this group.",
    icon: XMarkIcon,
    action: (group, event) => {
      event.preventDefault();
      const showCanceledTasks = get(group, "settings.showCanceledTasks", true);
      set(group, "settings.showCanceledTasks", !showCanceledTasks);
      commit("updateGroup", group);
    },
    active: (group) => get(group, "settings.showCanceledTasks", true),
  },
  {
    name: "Include in progress",
    tooltip:
      "If you want the tasks on this group to count in the day's progress.",
    icon: ArrowsUpDownIcon,
    action: (group, event) => {
      event.preventDefault();
      const showCanceledTasks = get(group, "settings.showCanceledTasks", true);
      set(group, "settings.showCanceledTasks", !showCanceledTasks);
      commit("updateGroup", group);
    },
    active: (group) => get(group, "settings.showCanceledTasks", true),
  },
];

/**
 * The menu actions that can be performed on a group.
 */
const menuActions = [
  {
    name: "Group settings",
    tooltip: "Manage the settings for this group",
    action: (group) => {
      commit("openSettingsScreen", "editGroup", group);
    },
    icon: Cog6ToothIcon,
  },
  {
    name: "Weekdays & time",
    tooltip: "Choose the days of the week in which this group will appear",
    action: (group) => {
      commit("openSettingsScreen", "editGroupWeekdays", group);
    },
    icon: CalendarDaysIcon,
  },
  {
    name: "Pick random task",
    tooltip: "Pick a random task within the active task list of this group",
    action: (group) => pickTaskInGroup(group),
    icon: BoltIcon,
    separator: true,
  },
  {
    name: "Run group as task",
    tooltip: "Start a session with the name of the group, instead of a task",
    action: (group) => pickTask(groupAsTask(group)),
    icon: PlayCircleIcon,
  },
  {
    name: "Delete",
    tooltip: "Delete group and all tasks in it",
    action: (group) => commit("deleteGroup", group),
    icon: TrashIcon,
    delete: true,
    separator: true,
  },
];
</script>

<template>
  <Menu as="div" class="relative inline-block text-left">
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
          <small class="px-4 py-1 mb-1 block">Options</small>
          <MenuItem
            v-slot="{ active }"
            v-for="(option, index) in menuFlags"
            v-tooltip="option.tooltip"
            :key="index"
          >
            <a
              href="#"
              @click="(e) => option.action(group, e)"
              :class="[
                option.active(group) ? '' : 'opacity-50',
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'group flex items-center px-4 py-2 text-sm justify-between',
              ]"
            >
              <span class="flex">
                <component
                  :is="option.icon"
                  class="mr-3 h-5 w-5"
                  :class="['text-gray-400 group-hover:text-gray-500']"
                  aria-hidden="true"
                />
                {{ option.name }}
              </span>
              <CheckIcon
                v-if="option.active(group)"
                class="h-4 w-4 text-green-700"
              />
            </a>
          </MenuItem>
        </div>

        <div class="py-1">
          <small class="px-4 py-1 mb-1 block">Actions</small>
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
            ]"
          >
            <a
              @click="(e) => menuAction.action(group, e)"
              href="#"
              :class="[
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                'group flex items-center px-4 py-2 text-sm',
                menuAction.delete ?? false ? 'text-red-700' : '',
              ]"
            >
              <component
                :is="menuAction.icon"
                class="mr-3 h-5 w-5"
                :class="[
                  menuAction.delete ?? false
                    ? 'text-red-700'
                    : 'text-gray-400 group-hover:text-gray-500',
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
