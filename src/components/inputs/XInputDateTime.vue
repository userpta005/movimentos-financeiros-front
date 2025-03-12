<template>
  <XInput
    v-model="value"
    mask="##/##/#### ##:##:##"
    clearable
  >
    <template #default>
      <q-popup-proxy
        @before-show="beforeShowPopup"
        ref="popupRef"
        transition-show="scale"
        transition-hide="scale"
      >
        <q-date
          v-show="showDate"
          v-model="qdate"
          @update:model-value="changeDate"
          :options="options"
          mask="YYYY-MM-DD"
          today-btn
        >
          <div class="row items-center justify-end q-gap-sm">
            <q-btn
              @click="showDate = false"
              icon="access_time"
              color="primary"
              flat
              no-caps
            />
            <q-btn
              v-close-popup
              label="Fechar"
              color="primary"
              flat
              no-caps
            />
          </div>
        </q-date>
        <q-time
          v-show="!showDate"
          v-model="qtime"
          @update:model-value="changeTime"
          mask="HH:mm:ss"
          format24h
        >
          <div class="row items-center justify-end q-gap-sm">
            <q-btn
              @click="showDate = true"
              icon="event"
              color="primary"
              flat
              no-caps
            />
            <q-btn
              v-close-popup
              label="Fechar"
              color="primary"
              flat
              no-caps
            />
          </div>
        </q-time>
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

const qdate = ref();
const qtime = ref();
const showDate = ref(true);

const value = computed({
  get() {
    if (dayjs(props.modelValue, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid()) {
      return dayjs(props.modelValue, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('DD/MM/YYYY HH:mm:ss');
    }
    return props.modelValue;
  },
  set(value) {
    if (dayjs(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid()) {
      emit('update:modelValue', value);
    } else if (dayjs(value, 'DD/MM/YYYY HH:mm:ss').isValid()) {
      emit('update:modelValue', dayjs(value, 'DD/MM/YYYY HH:mm:ss').toISOString());
      qdate.value = dayjs(value, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD');
      qtime.value = dayjs(value, 'DD/MM/YYYY HH:mm:ss').format('HH:mm:ss');
    } else {
      emit('update:modelValue', value);
      qdate.value = null;
      qtime.value = null;
    }
  },
});

const beforeShowPopup = () => {
  showDate.value = true;
};

const changeDate = (newValue) => {
  const newDate = dayjs(newValue, 'YYYY-MM-DD');
  const currentDate = dayjs(props.modelValue, 'YYYY-MM-DDTHH:mm:ss.SSSZ');

  const newDateTime = newDate
    .set('hour', currentDate.isValid() ? currentDate.get('hour') : 0)
    .set('minute', currentDate.isValid() ? currentDate.get('minute') : 0)
    .set('second', currentDate.isValid() ? currentDate.get('second') : 0);

  value.value = newDateTime.toISOString();
  qtime.value = newDateTime.format('HH:mm:ss');
  showDate.value = false;
};

const changeTime = (newValue) => {
  const newDate = dayjs(newValue, 'HH:mm:ss');
  const currentDate = dayjs(props.modelValue, 'YYYY-MM-DDTHH:mm:ss.SSSZ');

  const newDateTime = currentDate
    .set('hour', newDate.get('hour'))
    .set('minute', newDate.get('minute'))
    .set('second', newDate.get('second'));

  value.value = newDateTime.toISOString();
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue || dayjs(newValue, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid()) {
      if (!newValue) {
        qdate.value = null;
        qtime.value = null;
      }
      emit('watch');
    }
  }
);
</script>
