<template>
  <XInput
    v-model="value"
    mask="##:##"
    clearable
  >
    <template #default>
      <q-popup-proxy
        transition-show="scale"
        transition-hide="scale"
      >
        <q-time
          v-model="time"
          @update:model-value="changeTime"
          :options="options"
          mask="HH:mm:ss"
          minimal
        />
      </q-popup-proxy>
    </template>
    <template #append>
      <q-icon
        name="access_time"
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
      return dayjs(props.modelValue, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('HH:mm');
    }
    return props.modelValue;
  },
  set(value) {
    if (dayjs(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid()) {
      emit('update:modelValue', value);
    } else if (dayjs(value, 'HH:mm').isValid()) {
      emit('update:modelValue', dayjs(value, 'HH:mm').toISOString());
      time.value = dayjs(value, 'HH:mm').format('HH:mm:ss');
    } else {
      emit('update:modelValue', value);
      time.value = null;
    }
  },
});

const time = ref(null);

const changeTime = (newValue) => {
  value.value = dayjs(newValue, 'HH:mm:ss').toISOString();
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue || dayjs(newValue, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid()) {
      if (!newValue) {
        time.value = null;
      }
      emit('watch');
    }
  }
);
</script>
