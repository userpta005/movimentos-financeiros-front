<template>
  <q-field
    :type="type"
    lazy-rules="ondemand"
    hide-bottom-space
    outlined
    filled
    stack-label
  >
    <template
      v-if="!!value"
      #control
    >
      <template v-if="Array.isArray(value)">
        <template
          v-for="(item, index) in value"
          :key="index"
        >
          <XChip :label="item" />
        </template>
      </template>
      <div
        v-else
        :style="style"
        v-html="value"
      />
    </template>
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
  </q-field>
</template>

<script setup>
import { computed, useSlots } from 'vue';
import XChip from './XChip.vue';
const slots = useSlots();

const props = defineProps({
  value: {
    type: [String, Number, Array],
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
});

const style = computed(() => {
  const styleObj = { wordBreak: 'break-all' };

  if (props.type === 'textarea') {
    styleObj.minHeight = '100px';
  }

  return styleObj;
});
</script>
