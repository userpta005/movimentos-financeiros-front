<template>
  <XInput
    v-model="value"
    mask="##/##/####"
    clearable
  >
    <template #default>
      <q-popup-proxy
        transition-show="scale"
        transition-hide="scale"
      >
        <q-date
          v-model="qdate"
          @update:model-value="changeDate"
          :options="options"
          mask="YYYY-MM-DD"
        />
      </q-popup-proxy>
    </template>
    <template #append>
      <q-icon
        name="event"
        class="cursor-pointer"
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
  </XInput>
</template>

<script setup>
import { computed, ref, useSlots, watch } from 'vue';
import XInput from './XInput.vue';
import dayjs from 'src/composables/dayjs';

const slots = useSlots();

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
  },
  options: {
    type: Array,
    required: false,
  },
});

const emit = defineEmits(['update:modelValue', 'watch']);

const value = computed({
  get() {
    if (dayjs(props.modelValue, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid()) {
      return dayjs(props.modelValue, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('DD/MM/YYYY');
    }
    return props.modelValue;
  },
  set(value) {
    if (dayjs(value, 'YYYY-MM-DD').isValid()) {
      emit('update:modelValue', dayjs(value, 'YYYY-MM-DD').toISOString());
    } else if (dayjs(value, 'DD/MM/YYYY').isValid()) {
      emit('update:modelValue', dayjs(value, 'DD/MM/YYYY').toISOString());
      qdate.value = dayjs(value, 'DD/MM/YYYY').format('YYYY-MM-DD');
    } else {
      emit('update:modelValue', value);
      qdate.value = null;
    }
  },
});

const qdate = ref();

const changeDate = (newValue) => {
  if (dayjs(newValue, 'YYYY-MM-DD').isValid()) {
    value.value = dayjs(newValue, 'YYYY-MM-DD').toISOString();
  }
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue || dayjs(newValue, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid()) {
      if (!newValue) {
        qdate.value = null;
      }
      emit('watch');
    }
  }
);
</script>
