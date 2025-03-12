<template>
  <XSelectChip
    v-model:options="options"
    ref="select"
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
  </XSelectChip>
</template>

<script setup>
import { computed, useSlots } from 'vue';
import XSelectChip from './XSelectChip.vue';
import { useEnumsStore } from 'src/stores/enums';

const slots = useSlots();

const props = defineProps({
  enumName: {
    type: String,
    required: true,
  },
  except: {
    type: Array,
    required: false,
    default: () => [],
  },
});

const enums = useEnumsStore();

const options = computed(() => enums.getEnum(props.enumName, props.except));

defineExpose({
  resetFocused: () => select.value?.resetFocused(),
  focus: () => select.value?.focus(),
});
</script>
