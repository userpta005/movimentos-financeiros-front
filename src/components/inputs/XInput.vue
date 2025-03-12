<template>
  <q-input
    ref="inputRef"
    lazy-rules="ondemand"
    hide-bottom-space
    outlined
  >
    <template
      v-for="(_, slot) in slots"
      :key="slot"
      #[slot]="scope"
    >
      <slot
        :name="slot"
        v-bind="scope"
        :key="slot"
      />
    </template>
  </q-input>
</template>

<script setup>
import { ref, useSlots } from 'vue';

const slots = useSlots();
const inputRef = ref();

defineExpose({
  focus: () => {
    inputRef.value?.focus();
  },
});
</script>
