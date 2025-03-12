<template>
  <q-chip
    :color="color"
    :text-color="textColor"
    class="cursor-pointer"
    dense
  >
    <template #default>
      <span class="text-caption">{{ label }}</span>
      <slot name="tooltip" />
    </template>
  </q-chip>
</template>

<script setup>
import { computed } from 'vue';
import { colors } from 'quasar';

const props = defineProps({
  label: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
    default: 'primary',
  },
});

const textColor = computed(() => (colors.brightness(props.color) < 128 ? 'white' : 'black'));
</script>
