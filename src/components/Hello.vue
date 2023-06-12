<script setup>
import { login } from "@/auth";
import { CheckCircleIcon } from "@heroicons/vue/24/outline";
</script>

<template>
  <div
    class="relative isolate h-full overflow-hidden flex bg-[color:#ffffffcc]"
  >
    <svg
      class="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="0787a7c5-978c-4f66-83c7-11c213f99cb7"
          width="200"
          height="200"
          x="50%"
          y="-1"
          patternUnits="userSpaceOnUse"
        >
          <path d="M.5 200V.5H200" fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        stroke-width="0"
        fill="url(#0787a7c5-978c-4f66-83c7-11c213f99cb7)"
      />
    </svg>
    <div
      class="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40 items-center"
    >
      <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:shrink-0 lg:pt-8">
        <CheckCircleIcon
          class="mt-36 h-12 w-12 text-green-600"
          aria-hidden="true"
        />

        <h1 class="mt-10 text-4xl tracking-normal text-gray-900 sm:text-6xl">
          <span>Towards a better self,</span>
          <span class="block font-bold">one day at a time.</span>
        </h1>
        <p class="mt-6 text-lg leading-9 text-gray-600">
          Daily is a task organizer that goes beyond the traditional to-do list.
          It helps you prioritize your tasks and focus on what matters most.
        </p>
        <div class="mt-10 flex items-center gap-x-6">
          <a
            @click="login"
            class="flex items-center gap-4 rounded-md bg-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M17.788 5.108a9 9 0 1 0 3.212 6.892h-8" />
            </svg>
            <span>Login with Google</span>
          </a>
        </div>
      </div>
      <div
        class="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32"
      >
        <div class="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
          <div
            class="-m-2 hidden rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4"
          >
            <img
              src="https://tailwindui.com/img/component-images/project-app-screenshot.png"
              alt="App screenshot"
              width="2432"
              height="1442"
              class="w-[76rem] rounded-md shadow-2xl ring-1 ring-gray-900/10"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
