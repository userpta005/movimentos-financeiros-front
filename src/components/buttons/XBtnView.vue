<template>
  <XBtn
    icon="mdi-eye-outline"
    tooltip-label="Visualizar"
    dense
  >
    <template
      v-for="(_, slot) in slots"
      :key="slot"
      #[slot]="scope"
    >
      <slot
        v-bind="scope"
        :name="slot"
        :key="slot"
      >
      </slot>
    </template>
  </XBtn>
</template>

<script setup>
import { useSlots } from 'vue';
import XBtn from './XBtn.vue';

const slots = useSlots();
</script>
