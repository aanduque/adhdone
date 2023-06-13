<script setup lang="ts">
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import {
  Bars3Icon,
  BellIcon,
  XMarkIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";
import NotificationBell from "./NotificationBell.vue";
import UserMenu from "../UserMenu.vue";
import { inject } from "vue";

const user = inject("user", null);
</script>

<template>
  <Disclosure as="nav" class="bg-gray-800 print:hidden" v-slot="{ open }">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="shrink-0">
            <CheckCircleIcon class="h-8 w-8 text-white" aria-hidden="true" />
          </div>
        </div>
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <!-- Notifications Bell -->
            <NotificationBell />

            <!-- Profile dropdown -->
            <UserMenu />
          </div>
        </div>

        <!-- Mobile Menu -->
        <div class="-mr-2 flex md:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton
            class="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
            <XMarkIcon v-else class="block h-6 w-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
      </div>
      <!-- / Mobile Menu -->
    </div>

    <DisclosurePanel class="md:hidden">
      <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
        <DisclosureButton
          v-for="item in []"
          :key="item.name"
          as="a"
          :href="item.href"
          :class="[
            item.current
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
            'block px-3 py-2 rounded-md text-base font-medium',
          ]"
          :aria-current="item.current ? 'page' : undefined"
          >{{ item.name }}</DisclosureButton
        >
      </div>
      <div class="border-t border-gray-700 pt-4 pb-3">
        <div class="flex items-center px-5">
          <div class="shrink-0">
            <img class="h-10 w-10 rounded-full" :src="user.photoURL" alt="" />
          </div>
          <div class="ml-3">
            <div class="text-base font-medium text-white">
              {{ user.displayName ?? "" }}
            </div>
            <div class="text-sm font-medium text-gray-400">
              {{ user.email ?? "" }}
            </div>
          </div>
          <button
            type="button"
            class="ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            <span class="sr-only">View notifications</span>
            <BellIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-3 space-y-1 px-2">
          <DisclosureButton
            v-for="item in []"
            :key="item.name"
            as="a"
            :href="item.href"
            class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
            >{{ item.name }}</DisclosureButton
          >
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>
