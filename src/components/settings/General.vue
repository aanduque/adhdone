<template>
  <div class="py-6 px-4 sm:p-6 lg:pb-8" v-if="isTabActive('general')">
    <div>
      <h2 class="text-lg font-medium leading-6 text-gray-900">Profile</h2>
      <p class="mt-1 text-sm text-gray-500">
        This information will be displayed publicly so be careful what you
        share.
      </p>
    </div>

    <div class="mt-6 flex flex-col lg:flex-row">
      <div class="flex-grow space-y-6">
        <div>
          <label
            for="pomodoro-length"
            class="block text-sm font-medium text-gray-700"
            >Pomodoro Length</label
          >
          <div class="mt-1 flex rounded-md shadow-sm">
            <input
              type="number"
              name="pomodoro-length"
              id="pomodoro-length"
              v-model="settings.pomodoroLength"
              class="
                block
                w-full
                min-w-0
                flex-grow
                rounded-none rounded-l-md
                border-gray-300
                focus:border-sky-500 focus:ring-sky-500
                sm:text-sm
              "
            />
            <span
              class="
                inline-flex
                items-center
                rounded-r-md
                border border-l-0 border-gray-300
                bg-gray-50
                px-3
                text-gray-500
                sm:text-sm
              "
              >min</span
            >
          </div>
          <p class="mt-2 text-sm text-gray-500">
            The length, in minutes, of a work session.
          </p>
        </div>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-12 gap-6">
      <div class="col-span-12">
        <label
          for="max-active-groups"
          class="block text-sm font-medium text-gray-700"
          >Max Tasks per Group</label
        >
        <input
          type="number"
          name="max-tasks-per-group"
          id="max-tasks-per-group"
          v-model="settings.maxTasksPerGroup"
          class="
            mt-1
            block
            w-full
            rounded-md
            border border-gray-300
            py-2
            px-3
            shadow-sm
            focus:border-sky-500 focus:outline-none focus:ring-sky-500
            sm:text-sm
          "
        />
        <p class="mt-2 text-sm text-gray-500">
          The length, in minutes, of a work session.
        </p>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-12 gap-6">
      <div class="col-span-12">
        <label
          for="max-rounds-per-task"
          class="block text-sm font-medium text-gray-700"
          >Max Rounds per Task</label
        >
        <input
          type="number"
          name="max-rounds-per-task"
          id="max-rounds-per-task"
          v-model="settings.maxRoundsPerTask"
          class="
            mt-1
            block
            w-full
            rounded-md
            border border-gray-300
            py-2
            px-3
            shadow-sm
            focus:border-sky-500 focus:outline-none focus:ring-sky-500
            sm:text-sm
          "
        />
        <p class="mt-2 text-sm text-gray-500">
          The length, in minutes, of a work session.
        </p>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-12 gap-6">
      <div class="col-span-12">
        <label for="max-skips" class="block text-sm font-medium text-gray-700"
          >Allowed Skips</label
        >
        <input
          type="number"
          name="max-skips"
          id="max-skips"
          v-model="settings.maxSkips"
          class="
            mt-1
            block
            w-full
            rounded-md
            border border-gray-300
            py-2
            px-3
            shadow-sm
            focus:border-sky-500 focus:outline-none focus:ring-sky-500
            sm:text-sm
          "
        />
        <p class="mt-2 text-sm text-gray-500">
          The length, in minutes, of a work session.
        </p>
      </div>
    </div>
    <div class="mt-6 grid grid-cols-12 gap-6">
      <div class="col-span-12">
        <label
          for="max-active-groups"
          class="block text-sm font-medium text-gray-700"
          >Max Active Groups</label
        >
        <input
          type="number"
          name="max-active-groups"
          id="max-active-groups"
          v-model="settings.maxGroups"
          class="
            mt-1
            block
            w-full
            rounded-md
            border border-gray-300
            py-2
            px-3
            shadow-sm
            focus:border-sky-500 focus:outline-none focus:ring-sky-500
            sm:text-sm
          "
        />
        <p class="mt-2 text-sm text-gray-500">
          The length, in minutes, of a work session.
        </p>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-12 gap-6">
      <div class="col-span-12">
        <label
          for="max-active-groups"
          class="block text-sm font-medium text-gray-700"
          >Linear API</label
        >
        <input
          type="text"
          name="max-tasks-per-group"
          id="max-tasks-per-group"
          v-model="settings.linearApiKey"
          class="
            mt-1
            block
            w-full
            rounded-md
            border border-gray-300
            py-2
            px-3
            shadow-sm
            focus:border-sky-500 focus:outline-none focus:ring-sky-500
            sm:text-sm
          "
        />
        <p class="mt-2 text-sm text-gray-500">
          The length, in minutes, of a work session.
        </p>
      </div>
    </div>
  </div>
</template>