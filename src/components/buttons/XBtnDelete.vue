<template>
  <XBtn
    :dense="dense"
    tooltip-label="Excluir"
    icon="mdi-trash-can"
    color="red"
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

defineProps({
  dense: {
    type: Boolean,
    required: false,
    default: true,
  },
});
</script>
