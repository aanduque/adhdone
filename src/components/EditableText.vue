<template>
  <div class="truncate mr-auto">
    <div v-if="isEditing">
      <input
        v-model="text"
        @blur="isEditing = false"
        @keydown.enter="isEditing = false"
        v-bind="$attrs"
        :class="[$attrs.class]"
        v-focus
      />
    </div>
    <span
      v-else
      @dblclick="isEditing = true"
      v-html="formattedText"
      v-bind="$attrs"
      :class="[$attrs.class]"
    ></span>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";

export default {
  props: {
    modelValue: String,
  },
  inheritAttrs: false,
  setup(props, { emit }) {
    const isEditing = ref(false);
    const text = ref(props.modelValue ?? "");
    const formattedText = computed(() => {
      // transform the text to a formatted version
      // this is a placeholder, you should implement your own formatting
      return text.value
        ? text.value.replace("->", "→").split("\n").join("<br/>")
        : text.value;
    });

    // watch for changes in the text and emit the new value
    watch(text, (newText) => {
      emit("update:modelValue", newText);
    });

    // watch for changes in the isEditing and focus the input when it becomes true
    // watch(isEditing, (newIsEditing) => {
    //   if (newIsEditing) {
    //     nextTick(() => {
    //       inputRef.value.focus();
    //     });
    //   }
    // });

    return { isEditing, text, formattedText, receivedClasses: props.class };
  },
};
</script>
