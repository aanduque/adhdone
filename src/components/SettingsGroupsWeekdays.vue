<template>
  <div class="grid grid-cols-2 md:grid-cols-3 divide-y divide-gray-200">
    <SwitchGroup
      as="div"
      class="flex items-center justify-between p-4"
      :class="[day.class ?? '']"
      :key="day.name"
      v-for="(day, index) in week"
    >
      <span class="flex flex-grow flex-col">
        <SwitchLabel
          as="span"
          class="text-sm font-medium leading-6 text-gray-900"
          passive
        >
          {{ day.name }}
        </SwitchLabel>
        <SwitchDescription
          as="span"
          class="text-sm text-gray-500"
        ></SwitchDescription>
      </span>
      <Switch
        v-model="enabled"
        :class="[
          enabled ? 'bg-indigo-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
        ]"
      >
        <span
          aria-hidden="true"
          :class="[
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          ]"
        />
      </Switch>
    </SwitchGroup>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  Switch,
  SwitchDescription,
  SwitchGroup,
  SwitchLabel,
} from "@headlessui/vue";

const week = [
  { name: "Sunday", enabled: true, class: "col-span-2 sm:col-span-3" },
  { name: "Monday", enabled: true },
  { name: "Tuesday", enabled: false },
  { name: "Wednesday", enabled: true },
  { name: "Thursday", enabled: false },
  { name: "Friday", enabled: true },
  { name: "Saturday", enabled: false },
];

const enabled = ref(false);
</script>
