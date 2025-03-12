<template>
  <XBtn
    @click="
      $q.dialog({
        component: XDialogFile,
        componentProps: { prefix, archiveable_type, archiveable_id, viewable },
      })
    "
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
import XDialogFile from '../others/XDialogFile.vue';

defineProps({
  prefix: {
    type: String,
    required: true,
  },
  archiveable_type: {
    type: String,
    required: true,
  },
  archiveable_id: {
    type: Number,
    required: false,
  },
  viewable: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const slots = useSlots();
</script>
