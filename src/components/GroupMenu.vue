<script setup lang="ts">
import { findIndex } from "lodash";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import {
  Switch,
  SwitchDescription,
  SwitchGroup,
  SwitchLabel,
} from "@headlessui/vue";
import {
  TrashIcon,
  PlayCircleIcon,
  BoltIcon,
  EllipsisVerticalIcon,
  Cog6ToothIcon,
} from "@heroicons/vue/24/outline";
import EditableText from "./EditableText.vue";

const deleteGroup = (group) => {
  const groupIndex = findIndex(data.value.groups, ["id", group.id]);
  data.value.groups.splice(groupIndex, 1);
};

defineProps({
  group: null,
});

const menuOptions = [];

// <button
//   v-tooltip="'Pull tasks from integrations'"
//   @click.prevent="() => pullTasks(group)"
//   class="hidden items-center rounded-full bg-transparent p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 group-hover:flex"
// >
//   <ArrowPathIcon class="h-5 w-5" />
// </button>

/**
 * The menu actions that can be performed on a group.
 */
const menuActions = [
  {
    name: "Group settings",
    tooltip: "Manage the settings for this group",
    action: (group) => pickTaskInGroup(group),
    icon: Cog6ToothIcon,
  },
  {
    name: "Pick random task",
    tooltip: "Pick a random task within the active task list of this group",
    action: (group) => pickTaskInGroup(group),
    icon: BoltIcon,
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
    action: deleteGroup,
    icon: TrashIcon,
    delete: true,
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
          <MenuItem
            v-slot="{ active }"
            :key="menuAction.name"
            v-for="menuAction in menuActions"
            v-tooltip="menuAction.tooltip"
            as="div"
            :class="[
              menuAction.delete
                ? 'border-t border-gray-100 mt-1 pt-1 block'
                : '',
            ]"
          >
            <a
              @click.prevent="() => menuAction.action(group)"
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
