<template>
  <XSelect
    :option-label="optionLabel"
    ref="select"
    multiple
    use-chips
  >
    <template v-slot:selected-item="scope">
      <XChip
        v-if="scope.opt[optionLabel]"
        @remove="scope.removeAtIndex(scope.index)"
        :tabindex="scope.tabindex"
        :label="scope.opt[optionLabel]"
        removable
      />
    </template>
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
import XSelect from 'src/components/inputs/XSelect.vue';
import { ref, useSlots } from 'vue';
import XChip from '../others/XChip.vue';

const slots = useSlots();
const select = ref();

defineProps({
  optionLabel: {
    type: String,
    required: false,
    default: 'name',
  },
});

defineExpose({
  resetFocused: () => select.value?.resetFocused(),
  focus: () => select.value?.focus(),
  hydrateSelectedOptions: () => select.value?.hydrateSelectedOptions(),
  getOptions: () => select.value?.getOptions(),
});
</script>
