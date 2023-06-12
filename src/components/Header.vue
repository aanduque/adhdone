<template>
  <header class="bg-white shadow-sm print:hidden">
    <div class="container mx-auto p-4 sm:px-6 lg:px-8">
      <div class="items-center md:flex md:justify-between">
        <div class="flex min-w-0 flex-1 items-center">
          <!-- <h2
            class="
              text-2xl
              font-bold
              leading-7
              text-gray-900
              sm:truncate sm:text-2xl sm:tracking-tight
            "
          >
            Back End Developer
          </h2> -->
          <input
            class="w-full text-lg font-medium leading-7 text-gray-900 focus:outline-none sm:truncate sm:text-xl sm:tracking-tight lg:text-2xl"
            :size="data.pageTitle.length ? data.pageTitle.length - 4 : 20"
            :placeholder="today"
            v-model="data.pageTitle"
          />
        </div>
        <div class="mt-4 flex items-center md:mt-0 md:ml-4">
          <button
            type="button"
            class="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 lg:ml-3 lg:w-auto"
            @click.prevent="() => addGroup()"
          >
            <PlayCircleIcon
              class="mr-2 h-6 w-6 text-white"
              aria-hidden="true"
            />
            Add Group
          </button>
          <Menu as="div" class="relative ml-2 inline-block text-left">
            <div>
              <MenuButton
                class="flex items-center rounded-full text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              >
                <span class="sr-only">Open options</span>
                <EllipsisVerticalIcon class="h-6 w-6" aria-hidden="true" />
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
                class="absolute right-0 z-20 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div class="py-1">
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      @click.prevent="
                        () => {
                          data = clearState();
                        }
                      "
                      :class="[
                        active
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700',
                        'group flex items-center px-4 py-2 text-sm',
                      ]"
                    >
                      <DocumentDuplicateIcon
                        class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      Duplicate
                    </a>
                  </MenuItem>
                </div>
                <div class="py-1">
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      @click.prevent="() => (settingsOpened = true)"
                      :class="[
                        active
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700',
                        'group flex items-center px-4 py-2 text-sm',
                      ]"
                    >
                      <Cog8ToothIcon
                        class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      Settings
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700',
                        'group flex items-center px-4 py-2 text-sm',
                      ]"
                    >
                      <TagIcon
                        class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      Categories
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700',
                        'group flex items-center px-4 py-2 text-sm',
                      ]"
                    >
                      <LinkIcon
                        class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      Integrations
                    </a>
                  </MenuItem>
                </div>
                <div class="py-1">
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700',
                        'group flex items-center px-4 py-2 text-sm',
                      ]"
                    >
                      <UserPlusIcon
                        class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      Share
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      @click.prevent="
                        () => {
                          const jsonToDownload = Object.assign({}, data, {
                            hash,
                          });
                          download(
                            JSON.stringify(jsonToDownload),
                            `${exportFileName}.tasks.json`
                          );
                        }
                      "
                      :class="[
                        active
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700',
                        'group flex items-center px-4 py-2 text-sm',
                      ]"
                    >
                      <ArrowDownCircleIcon
                        class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      Export
                    </a>
                  </MenuItem>
                </div>
                <div class="py-1">
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700',
                        'group flex items-center px-4 py-2 text-sm',
                      ]"
                    >
                      <CheckCircleIcon
                        class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      Remove Finished
                    </a>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700',
                        'group flex items-center px-4 py-2 text-sm',
                      ]"
                    >
                      <TrashIcon
                        class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                      Clear All
                    </a>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>
  </header>
</template>