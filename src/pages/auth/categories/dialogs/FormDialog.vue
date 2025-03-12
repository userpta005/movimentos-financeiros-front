<template>
  <XGroup>
    <XInput
      v-model="item.name"
      :rules="[(val) => !!val || 'Nome é obrigatório!']"
      class="col-md-6 col-xs-12"
      label="Nome"
      maxlength="255"
    />

    <XSelectEnum
      v-model="item.is_active"
      :rules="[(val) => !!val || 'Ativo é obrigatório!']"
      class="col-md-6 col-xs-12"
      label="Ativo"
      enum-name="is-active"
    />

    <XBtnGroup class="col-12">
      <XBtn
        :loading="loading"
        type="submit"
        label="Confirmar"
      />
    </XBtnGroup>
  </XGroup>
</template>

<script setup>
import { computed } from 'vue';
import XBtn from 'src/components/buttons/XBtn.vue';
import XInput from 'src/components/inputs/XInput.vue';
import XBtnGroup from 'src/components/others/XBtnGroup.vue';
import XSelectEnum from 'src/components/inputs/XSelectEnum.vue';
import XGroup from 'src/components/others/XGroup.vue';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const item = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
</script>
