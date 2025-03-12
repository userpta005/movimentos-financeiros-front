<template>
  <q-file
    @rejected="onRejected"
    v-model="value"
    ref="QFileRef"
    for="QFileRef"
    accept=".jpg,.jpeg,.png,.pdf,.xls,.xlsx"
    max-file-size="20000000"
    lazy-rules="ondemand"
    hide-bottom-space
    outlined
  >
    <template v-slot:prepend>
      <label for="QFileRef">
        <XBtn
          @click="openFileInput"
          tooltip-label="Procurar Arquivos"
          icon="mdi-file-find"
          dense
          flat
        />
      </label>
    </template>
    <template v-slot:after>
      <XBtn
        @click="$q.dialog({ component: XDialogFile, componentProps: { prefix, archiveable_type, archiveable_id, viewable } })"
        tooltip-label="Ver Arquivos Atuais"
        icon="mdi-eye"
        dense
        flat
        v-viewer
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
  </q-file>
</template>

<script setup>
import { computed, ref, useSlots, watch } from 'vue';
import XBtn from '../buttons/XBtn.vue';
import notify from 'src/composables/notify';
import { useQuasar } from 'quasar';
import XDialogFile from '../others/XDialogFile.vue';
import helpers from 'src/composables/helpers';

const QFileRef = ref();
const slots = useSlots();
const $q = useQuasar();

const props = defineProps({
  modelValue: {
    required: false,
  },
  archives: {
    type: Array,
    required: false,
  },
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

const emit = defineEmits(['update:modelValue', 'update:archives']);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const archives = computed({
  get() {
    return props.archives;
  },
  set(value) {
    emit('update:archives', value);
  },
});

watch(value, async () => {
  if ((Array.isArray(value.value) && value.value.length > 0) || value.value instanceof File) {
    archives.value = await helpers.convertFilesToBase64(value.value, props.prefix);
  }
});

const openFileInput = () => {
  const input = document.getElementById('QFileRef');
  input.click();
};

const onRejected = (rejectedEntries) => {
  if (rejectedEntries[0].failedPropValidation === 'accept') {
    notify.error('Atenção, formato inválido! Insira um arquivo em um desses formatos: .jpg, .jpeg, .png, .pdd, .xls ou .xlsx!');
  } else if (rejectedEntries[0].failedPropValidation === 'max-file-size') {
    notify.error('Atenção, arquivo muito grande! Tamanho máximo permitido: 20MB!');
  }
};
</script>
