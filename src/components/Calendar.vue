<script setup lang="ts">
import {
  BookOpenIcon,
  ClockIcon,
  Square2StackIcon,
} from "@heroicons/vue/24/outline";
import { nextTick, ref, toRefs, onMounted, computed } from "vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import moment from "moment";
import { isArray } from "lodash";

const c = console;

const vuecal = ref(null);

const currentBlock = ref(null);

const props = defineProps<{
  sessions: any;
  groups: any;
}>();

const { sessions } = toRefs(props);

const events = computed(() =>
  isArray(sessions.value)
    ? sessions.value.map((session) => {
        console.log(session);
        return {
          start: moment(session.startedAt).format("YYYY-MM-DD HH:mm"),
          end: moment(session.endedAt).format("YYYY-MM-DD HH:mm"),
          // You can also define event dates with Javascript Date objects:
          // start: new Date(2018, 11 - 1, 16, 10, 30),
          // end: new Date(2018, 11 - 1, 16, 11, 30),
          title: "Doctor appointment",
          content: '<i class="icon material-icons">local_hospital</i>',
          class: "health",
          split: "sessions",
        };
      })
    : []
);

// `timeCellHeight` is set to 26 in the component data.
const scrollToCurrentTime = () => {
  const hours =
    vuecal.value.now.getHours() + vuecal.value.now.getMinutes() / 60;
  nextTick(() => {
    const calel = document.querySelector(".vuecal__bg");
    // console.log(calel);
    calel.scrollTo({
      top: hours * vuecal.value.timeCellHeight,
      behavior: "smooth",
    });
  });
};

const scrollToTop = () => {
  const calendar = document.querySelector("#vuecal .vuecal__bg");
  calendar.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(() => {
  // console.log("sasa", sessions.value);
});

// const events = ref([
//   {
//     start: "2023-01-15 10:30",
//     end: "2023-01-15 11:30",
//     // You can also define event dates with Javascript Date objects:
//     // start: new Date(2018, 11 - 1, 16, 10, 30),
//     // end: new Date(2018, 11 - 1, 16, 11, 30),
//     title: "Doctor appointment",
//     content: '<i class="icon material-icons">local_hospital</i>',
//     class: "health",
//     split: 1,
//   },
// ]);

const splits = [
  {
    id: "blocks",
    label: "Blocks",
    color: "red",
    class: "blocks",
    icon: Square2StackIcon,
  },
  {
    id: "sessions",
    label: "Focus Sessions",
    color: "blue",
    class: "sessions",
    icon: ClockIcon,
  },
  {
    id: "notes",
    label: "Notes",
    color: "blue",
    class: "notes",
    icon: BookOpenIcon,
  },
];

const onEventCreate = (event, deleteEventFunction) => {
  event.allowedGroups = event.allowedGroups ?? [];
  if (event.split === "blocks") {
    event.title = "New Block";
    event.content = "";
    currentBlock.value = event;
  }
  return event;
};
</script>

<template>
  <div class="col-span-12 grid grid-cols-12">
    <div class="col-span-8">
      <VueCal
        class="max-h-[80vh]"
        locale="en"
        @ready="() => scrollToCurrentTime()"
        :time-cell-height="40"
        ref="vuecal"
        :hide-view-selector="true"
        :hide-weekends="false"
        :hide-title-bar="true"
        :time-from="1 * 60"
        height="600"
        :time-step="10"
        :time-to="24 * 60"
        :disable-views="['years', 'year', 'week', 'month']"
        active-view="day"
        :cell-click-hold="false"
        :drag-to-create-event="true"
        :min-date="new Date()"
        :max-date="new Date()"
        :split-days="splits"
        :events="events"
        editable-events
        sticky-split-labels
        @cell-dblclick="(...args) => c.log(args)"
        :on-event-create="onEventCreate"
      >
        <!-- <template #title="args">{{ JSON.stringify(args) }}</template> -->
        <template #split-label="{ split, view }">
          <span
            class="flex items-center gap-2 text-gray-500"
            :style="`_color: ${split.color}`"
          >
            <component :is="split.icon" class="h-4 w-4" />
            {{ split.label }}</span
          >
        </template>
        <template #time-cell="{ hours, minutes }">
          <div :class="{ 'vuecal__time-cell-line': true, hours: !minutes }">
            <strong v-if="!minutes" style="font-size: 15px">{{ hours }}</strong>
            <span v-else style="font-size: 11px">{{ minutes }}</span>
          </div>
        </template>
        <template #no-event>&nbsp;</template>
        <template #event="{ event, view }">
          <!-- <v-icon>{{ event.icon }}</v-icon> -->

          <div class="vuecal__event-title" v-html="event.title" />
          <!-- Or if your events are editable: -->
          <div
            class="vuecal__event-title vuecal__event-title--edit"
            contenteditable
            @blur="event.title = $event.target.innerHTML"
            v-html="event.title"
          />

          <div>{{ event.content }}</div>
          <div>
            {{
              event.allowedGroups.length === 0
                ? "No groups allowed"
                : `${event.allowedGroups.length} group(s) allowed.`
            }}
          </div>

          <small class="vuecal__event-time">
            <!-- Using Vue Cal Date prototypes (activated by default) -->
            <strong>Event start:</strong>
            <span>{{ event.start.formatTime("h O'clock") }}</span
            ><br />
            <strong>Event end:</strong>
            <span>{{ event.end.formatTime("h O'clock") }}</span>
          </small>
        </template>
      </VueCal>
    </div>
    <div class="col-span-4 bg-gray-50 p-8">
      <div class="space-y-6" v-if="currentBlock">
        <div>
          <h1 class="text-lg font-medium leading-6 text-gray-900">
            Block Settings
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            Blocks are a useful way to limit what kind of tasks you can do in
            each part of the day.
          </p>
        </div>

        <div>
          <label
            for="block-name"
            class="block text-sm font-medium text-gray-700"
            >Block Name</label
          >
          <div class="mt-1">
            <input
              type="text"
              name="block-name"
              id="block-name"
              class="
                block
                w-full
                rounded-md
                border-gray-300
                shadow-sm
                focus:border-sky-500 focus:ring-sky-500
                sm:text-sm
              "
              v-model="currentBlock.title"
            />
          </div>
        </div>

        <div>
          <label
            for="description"
            class="block text-sm font-medium text-gray-700"
            >Description</label
          >
          <div class="mt-1">
            <textarea
              id="description"
              name="description"
              v-model="currentBlock.content"
              rows="3"
              class="
                block
                w-full
                rounded-md
                border-gray-300
                shadow-sm
                focus:border-sky-500 focus:ring-sky-500
                sm:text-sm
              "
            />
          </div>
        </div>

        <div>
          <label for="groups" class="block text-sm font-medium text-gray-700"
            >Groups</label
          >
          <fieldset class="mt-4">
            <legend class="sr-only">Allowed Groups</legend>
            <div class="sm:grid grid-cols-2 sm:items-center gap-4">
              <div
                v-for="(group, groupIndex) in groups"
                :key="group.id"
                class="flex items-center"
              >
                <input
                  :id="group.id"
                  name="allowed-groups"
                  type="checkbox"
                  :key="group.id"
                  :checked="currentBlock.allowedGroups.includes(group.id)"
                  v-model="currentBlock.allowedGroups"
                  :value="group.id"
                  class="
                    h-4
                    w-4
                    border-gray-300
                    text-indigo-600
                    focus:ring-indigo-500
                  "
                />
                <label
                  :for="group.id"
                  class="ml-3 block text-sm font-medium text-gray-700"
                  >{{ group.name }}</label
                >
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.vuecal__time-cell-line.hours:before {
  /* border-color: #42b983; */
}
.vuecal .day-split-header {
  font-size: 11px;
}
.vuecal__body .sessions {
  background-color: #fcfcfc;
}
.vuecal__body .blocks {
  /* background-color: rgba(255, 255, 255, 0.1); */
}
.vuecal__body .split3 {
  background-color: rgba(255, 243, 224, 0.7);
}
.vuecal__body .split4 {
  background-color: rgba(255, 235, 238, 0.7);
}
.vuecal__no-event {
  /* display: none; */
}
</style>