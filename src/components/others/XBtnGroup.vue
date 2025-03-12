<template>
  <div
    :class="[size, position]"
    class="row"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'q-gap-sm',
  },
  position: {
    type: String,
    default: 'right',
    validator(value) {
      return ['left', 'center', 'right'].includes(value);
    },
  },
});

const positions = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

const position = computed(() => {
  return positions[props.position];
});
</script>
