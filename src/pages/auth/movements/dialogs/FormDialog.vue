<template>
  <XGroup>
    <XSelectEnum
      v-model="item.type"
      :rules="[(val) => !!val || 'Tipo é obrigatório!']"
      class="col-md-6 col-xs-12"
      label="Tipo"
      enum-name="movements.type"
    />
    <XInputMoney
      v-model="item.value"
      :rules="[(val) => !!val || 'Valor é obrigatório!']"
      class="col-md-6 col-xs-12"
      label="Valor"
    />
    <XSelect
      v-model="item.category_id"
      :rules="[(val) => !!val || 'Categorias é obrigatório!']"
      :api-args="{ select: ['id', 'name'], whereIsActive: true }"
      :fetch-when-focused="true"
      :use-filter="true"
      class="col-md-6 col-xs-12"
      label="Categorias"
      option-label="name"
      api-url="/api/unsafe/categories"
      clearable
    />
    <XInput
      v-model="item.description"
      :rules="[(val) => !!val || 'Descrição é obrigatório!']"
      class="col-md-6 col-xs-12"
      label="Descrição"
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
import XInputMoney from 'src/components/inputs/XInputMoney.vue';
import XSelect from 'src/components/inputs/XSelect.vue';

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
