<template>
  <XInput
    v-model="exibition"
    ref="XInputRef"
    clearable
  >
    <template #default>
      <q-popup-proxy
        transition-show="scale"
        transition-hide="scale"
      >
        <q-date
          v-model="qdate"
          :options="options"
          range
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
      v-slot:[slot]="scope"
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
import { computed, onMounted, ref, useSlots, watch } from 'vue';
import XInput from './XInput.vue';
import dayjs from 'src/composables/dayjs';

const XInputRef = ref();
const hasError = computed(() => XInputRef.value?.hasError);

defineExpose({
  hasError,
});

const slots = useSlots();

const props = defineProps({
  modelValue: {
    type: Object,
    required: false,
  },
  options: {
    type: Array,
    required: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const formats = {
  formatOne: 'YYYY-MM-DD',
  formatTwo: 'YYYY/MM/DD',
  formatThree: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  exibition: 'DD/MM/YYYY',
};

const validate = (date, format) => dayjs(date, formats[format]).isValid();
const formattedDate = (date, formatBase, newFormat) => dayjs(date, formats[formatBase]).format(formats[newFormat]);
const formattedForIso = (date, formatBase) => dayjs(date, formats[formatBase]).toISOString();

const value = computed({
  set(value) {
    if (validate(value.from, 'formatOne') && validate(value.to, 'formatOne')) {
      emit('update:modelValue', {
        from: formattedForIso(value.from, 'formatOne'),
        to: formattedForIso(value.to, 'formatOne'),
      });
    } else if (validate(value.from, 'formatTwo') && validate(value.to, 'formatTwo')) {
      emit('update:modelValue', {
        from: formattedForIso(value.from, 'formatTwo'),
        to: formattedForIso(value.to, 'formatTwo'),
      });
      qdate.value = {
        from: formattedForIso(value.from, 'formatTwo'),
        to: formattedForIso(value.to, 'formatTwo'),
      };
    } else {
      emit('update:modelValue', value);
      qdate.value = null;
    }
  },
});

const qdate = ref({
  from: null,
  to: null,
});

const exibition = ref();

const exibitionFormat = (newValue) => {
  if (!newValue.from) return (exibition.value = null);
  if (newValue.from === newValue.to) return (exibition.value = formattedDate(newValue.from, 'formatTwo', 'exibition'));

  const from = formattedDate(newValue.from, 'formatTwo', 'exibition');
  const to = formattedDate(newValue.to, 'formatTwo', 'exibition');

  exibition.value = `${from} - ${to}`;
};

watch(qdate, (newValue) => {
  if (!newValue) {
    return (value.value = {
      from: null,
      to: null,
    });
  }

  if (typeof newValue === 'string') {
    value.value = {
      from: formattedForIso(newValue, 'formatOne'),
      to: formattedForIso(newValue, 'formatOne'),
    };
  }

  if (validate(newValue.from, 'formatOne') && validate(newValue.to, 'formatOne')) {
    value.value = {
      from: formattedForIso(newValue.from, 'formatOne'),
      to: formattedForIso(newValue.to, 'formatOne'),
    };
  }
});

watch(exibition, (newValue, oldValue) => {
  if (oldValue && !newValue) {
    value.value = {
      from: null,
      to: null,
    };
    qdate.value = {
      from: null,
      to: null,
    };
  }
});

watch(
  () => props.modelValue,
  (newValue) => {
    exibitionFormat(newValue);
  }
);

onMounted(() => {
  exibitionFormat(props.modelValue);
});
</script>
