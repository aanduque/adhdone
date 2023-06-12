<template>
  <div class="-mr-4 -mt-2 flex items-center">
    <div
      v-if="isGroupHovered(group)"
      class="p-2"
      v-tooltip="'This group is currently selected'"
    >
      <CheckIcon class="h-5 w-5 text-indigo-700" />
    </div>
    <button
      @click.prevent="() => pickTask(groupAsTask(group))"
      v-tooltip="'Run group as task'"
      class="group-move-handle hidden items-center rounded-full bg-transparent p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 group-hover:flex"
    >
      <PlayCircleIcon class="h-5 w-5" />
    </button>
    <button
      v-tooltip="'Pick task within this group'"
      @click.prevent="() => pickTaskInGroup(group)"
      class="hidden items-center rounded-full bg-transparent p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 group-hover:flex"
    >
      <BoltIcon class="h-5 w-5" />
    </button>
    <button
      v-tooltip="'Pull tasks from integrations'"
      @click.prevent="() => pullTasks(group)"
      class="hidden items-center rounded-full bg-transparent p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 group-hover:flex"
    >
      <ArrowPathIcon class="h-5 w-5" />
    </button>
    <button
      @click.prevent="() => {}"
      v-tooltip="'Drag to reorder groups'"
      class="group-move-handle hidden items-center rounded-full bg-transparent p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 group-hover:flex"
    >
      <ArrowsPointingOutIcon class="h-5 w-5" />
    </button>
    <Menu as="div" class="relative inline-block text-left">
      <div>
        <MenuButton
          v-tooltip="'Group settings'"
          class="hidden items-center rounded-full bg-transparent p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 group-hover:flex"
        >
          <span class="sr-only">Open options</span>
          <Cog8ToothIcon class="h-5 w-5" aria-hidden="true" />
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
          class="absolute right-0 z-20 mt-2 w-72 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div class="py-1">
            <MenuItem v-slot="{ active }">
              <a
                href="#"
                :class="[
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  'flex justify-between px-4 py-2 text-sm',
                ]"
              >
                <SwitchGroup as="div" class="flex items-center justify-between">
                  <span class="flex grow flex-col">
                    <SwitchLabel
                      as="span"
                      class="text-sm font-medium text-gray-900"
                      passive
                      >Ignore group</SwitchLabel
                    >
                    <SwitchDescription as="span" class="text-sm text-gray-500"
                      >Prevent tasks from this group from being
                      picked.</SwitchDescription
                    >
                  </span>
                  <Switch
                    v-model="group.ignore"
                    :class="[
                      group.ignore ? 'bg-indigo-600' : 'bg-gray-200',
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                    ]"
                  >
                    <span
                      aria-hidden="true"
                      :class="[
                        group.ignore ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      ]"
                    />
                  </Switch>
                </SwitchGroup>
              </a>
            </MenuItem>
          </div>
          <div class="py-1">
            <MenuItem v-slot="{ active }">
              <a
                href="#"
                :class="[
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  'flex justify-between px-4 py-2 text-sm',
                ]"
              >
                <SwitchGroup as="div" class="flex items-center justify-between">
                  <span class="flex grow flex-col">
                    <SwitchLabel
                      as="span"
                      class="text-sm font-medium text-gray-900"
                      passive
                      >Block Checlist</SwitchLabel
                    >
                    <SwitchDescription as="span" class="text-sm text-gray-500"
                      >Block checklists are a special kind of group, that needs
                      to be completed before the other groups are
                      available.</SwitchDescription
                    >
                  </span>
                  <Switch
                    @update:model-value="
                      () => activeBlock && (activeBlock.checklist = group.id)
                    "
                    :modelValue="activeBlock?.checklist === group.id"
                    :class="[
                      group.ignore ? 'bg-indigo-600' : 'bg-gray-200',
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                    ]"
                  >
                    <span
                      aria-hidden="true"
                      :class="[
                        group.ignore ? 'translate-x-5' : 'translate-x-0',
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      ]"
                    />
                  </Switch>
                </SwitchGroup>
              </a>
            </MenuItem>
          </div>
          <div class="py-1">
            <MenuItem v-slot="{ active }">
              <a
                @click.prevent="() => deleteGroup(group)"
                href="#"
                :class="[
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  'group flex items-center px-4 py-2 text-sm',
                ]"
              >
                <TrashIcon
                  class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                Delete
              </a>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
