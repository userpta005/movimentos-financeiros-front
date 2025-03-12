<template>
  <XSelect v-model:options="options">
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
  </XSelect>
</template>

<script setup>
import { computed, useSlots } from 'vue';
import { useEnumsStore } from 'src/stores/enums';
import XSelect from 'src/components/inputs/XSelect.vue';

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
</script>
