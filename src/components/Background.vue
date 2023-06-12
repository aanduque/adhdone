<script setup>
import { onMounted, ref } from "vue";
import bg from "@/assets/groups-bg.png";

const backgroundImage = ref({
  backgroundImage: `url(${bg})`,
});
</script>

<template>
  <div id="app-shell" class="h-full">
    <div
      class="absolute inset-0 opacity-10 md:opacity-10 filter grayscale bg-[length:70%] bg-[position:right_105%] bg-no-repeat"
      :style="backgroundImage"
    >
      &nbsp;
    </div>
    <slot></slot>
  </div>
</template>
