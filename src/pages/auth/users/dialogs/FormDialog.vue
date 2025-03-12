<template>
  <XGroup>
    <XInput
      v-model="item.name"
      :rules="[(val) => !!val || 'Nome é obrigatório!']"
      class="col-md-6 col-xs-12"
      label="Nome"
      maxlength="255"
    />

    <XInput
      v-model="item.surname"
      :rules="[(val) => !!val || 'Sobrenome é obrigatório!']"
      class="col-md-6 col-xs-12"
      label="Sobrenome"
      maxlength="255"
    />

    <XSelectEnum
      v-model="item.gender"
      :rules="[(val) => !!val || 'Gênero é obrigatório!']"
      class="col-md-6 col-xs-12"
      label="Gênero"
      enum-name="gender"
    />

    <XSelectEnum
      v-model="item.status"
      :rules="[(val) => !!val || 'Status é obrigatório!']"
      class="col-md-6 col-xs-12"
      label="Status"
      enum-name="users.user-status"
    />

    <XInput
      v-model="item.email"
      :rules="[(val) => !!val || 'Email é obrigatório!']"
      type="email"
      class="col-md-6 col-xs-12"
      label="Email"
      maxlength="255"
    />

    <XSelectChip
      v-model="item.roles_ids"
      :rules="[(val) => val?.length > 0 || 'Ao menos um cargo é obrigatório!']"
      :api-args="{
        select: ['id', 'name'],
        whereIsActive: true,
      }"
      :fetch-when-focused="true"
      :use-filter="true"
      ref="selectRoles"
      class="col-md-6 col-xs-12"
      label="Funções"
      option-label="name"
      api-url="/api/unsafe/roles"
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
import XSelectChip from 'src/components/inputs/XSelectChip.vue';
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
