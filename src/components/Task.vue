<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  active: boolean;
  done: boolean;
  counter: number;
  jumped: boolean;
}>();
</script>

<template>
  <div
    class="relative flex items-start"
    :class="[active ? 'bg-gray-200' : '', done ? 'opacity-75' : '']"
  >
    <div class="flex h-5 items-center">
      <input
        id="comments"
        aria-describedby="comments-description"
        name="comments"
        type="checkbox"
        class="
          h-4
          w-4
          rounded
          border-gray-300
          text-indigo-600
          focus:ring-indigo-500
        "
        v-model="done"
      />
    </div>
    <div class="ml-3 text-sm">
      <label
        for="comments"
        class="
          font-medium
          text-gray-700
          focus:b-0 focus:outline-none
          flex flex-grow
        "
      >
        <input
          class="
            font-medium
            text-gray-700
            bg-transparent
            focus:border-none focus:outline-none
            flex flex-grow
          "
          :class="[done ? 'line-through' : '']"
          v-model.lazy="title"
          placeholder="Task"
        />
        <span v-if="jumped">(Jumped)</span>
        <span>{{ counter }}</span>
      </label>
      <!-- <p id="comments-description" class="text-gray-500"><input class="text-gray-500 focus:outline-none" v-model.lazy="task.description" placeholder="Task description"></p> -->
    </div>
  </div>
</template>

<style scoped></style>
