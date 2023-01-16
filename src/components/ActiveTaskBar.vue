<script setup lang="ts">
import { XMarkIcon, CheckCircleIcon } from "@heroicons/vue/24/outline";

defineProps<{
  task: any;
  fullScreen?: boolean;
}>();
</script>

<template>
  <div
    class="z-10 fixed bottom-0 flex flex-col overflow-auto print:hidden"
    :class="
      task && (fullScreen ?? false)
        ? 'inset-0'
        : 'inset-x-0 mb-4 mx-4 rounded-lg drop-shadow-2xl'
    "
  >
    <!-- Content -->
    <div v-if="fullScreen ?? false" class="flex flex-1 items-stretch bg-white">
      <div class="grid flex-1 grid-cols-12 items-center self-stretch">
        <div class="col-span-4 bg-white">
          <div class="mx-auto max-w-7xl py-16 px-6 sm:py-24 lg:px-8">
            <div class="text-center">
              <h2 class="text-lg font-semibold text-indigo-600">Pricing</h2>
              <p
                class="
                  mt-1
                  text-4xl
                  font-bold
                  tracking-tight
                  text-gray-900
                  sm:text-5xl
                  lg:text-6xl
                "
              >
                Take control of your team.
              </p>
              <p class="mx-auto mt-5 max-w-xl text-xl text-gray-500">
                Start building for free, then add a site plan to go live.
                Account plans unlock additional features.
              </p>
            </div>
          </div>
        </div>

        <div class="col-span-8 pt-12 sm:pt-16 lg:pt-20">
          <h2
            class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl"
          >
            On a mission to empower teams
          </h2>
          <div class="mt-6 space-y-6 text-gray-500">
            <p class="text-lg">
              Sagittis scelerisque nulla cursus in enim consectetur quam. Dictum
              urna sed consectetur neque tristique pellentesque. Blandit amet,
              sed aenean erat arcu morbi. Cursus faucibus nunc nisl netus morbi
              vel porttitor vitae ut. Amet vitae fames senectus vitae.
            </p>
            <p class="text-base leading-7">
              Sollicitudin tristique eros erat odio sed vitae, consequat turpis
              elementum. Lorem nibh vel, eget pretium arcu vitae. Eros eu
              viverra donec ut volutpat donec laoreet quam urna. Sollicitudin
              tristique eros erat odio sed vitae, consequat turpis elementum.
              Lorem nibh vel, eget pretium arcu vitae. Eros eu viverra donec ut
              volutpat donec laoreet quam urna.
            </p>
            <p class="text-base leading-7">
              Rhoncus nisl, libero egestas diam fermentum dui. At quis tincidunt
              vel ultricies. Vulputate aliquet velit faucibus semper.
              Pellentesque in venenatis vestibulum consectetur nibh id. In id ut
              tempus egestas. Enim sit aliquam nec, a. Morbi enim fermentum
              lacus in. Viverra.
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- End Content -->
    <!-- Activity Bar -->
    <div class="bg-indigo-600">
      <div class="mx-auto py-3 px-3 sm:px-6 lg:px-4">
        <div class="flex flex-wrap items-center justify-between">
          <!-- Item -->
          <div class="flex w-0 flex-1 items-center" v-if="task">
            <span class="rounded-lg bg-indigo-800 p-2 hidden md:flex">
              <CheckCircleIcon class="h-6 w-6 text-white" aria-hidden="true" />
            </span>
            <p class="ml-3 truncate text-white flex gap-2">
              <span class="font-medium">{{ task.title }}</span>
              <span
                v-if="task.description"
                class="hidden md:inline text-indigo-200"
                >{{ task.description }}</span
              >
            </p>
          </div>

          <div class="flex w-0 flex-1 items-center" v-else>
            <span class="flex rounded-lg bg-indigo-800 p-2">
              <CheckCircleIcon class="h-6 w-6 text-white" aria-hidden="true" />
            </span>
            <p class="ml-3 flex gap-2 truncate text-white">
              <span class="font-medium">Let's get started!</span>
            </p>
          </div>

          <div
            class="
              order-3
              mt-0
              flex
              w-full
              flex-shrink-0
              gap-x-2
              sm:order-2 sm:w-auto
            "
          >
            <slot></slot>
          </div>
          <div class="order-2 hidden flex-shrink-0 sm:order-3 sm:ml-3">
            <button
              type="button"
              @click="() => (open = false)"
              class="
                -mr-1
                flex
                rounded-md
                p-2
                hover:bg-indigo-500
                focus:outline-none focus:ring-2 focus:ring-white
                sm:-mr-2
              "
            >
              <span class="sr-only">Dismiss</span>
              <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
