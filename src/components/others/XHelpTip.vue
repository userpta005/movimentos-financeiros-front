<template>
  <q-icon
    name="mdi-help-circle"
    color="warning"
    size="32px"
  >
    <q-tooltip style="font-size: 14px">
      <template
        v-if="content !== null && content !== undefined"
        v-slot:control
      >
        <div v-html="content" />
      </template>
      <template
        v-for="(_, slot) in slots"
        :key="slot"
        v-slot:[slot]="scope"
      >
        <slot
          v-bind="scope"
          :name="slot"
          :key="slot"
        >
        </slot>
      </template>
    </q-tooltip>
  </q-icon>
</template>

<script setup>
import { useSlots } from 'vue';

const slots = useSlots();

defineProps({
  content: {
    type: [String, Number],
    required: false,
    default: null,
  },
});
</script>
