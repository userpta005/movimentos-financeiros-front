<template>
  <XGroup>
    <XInput
      v-model="item.name"
      :rules="[(val) => !!val || 'Nome é obrigatório!']"
      class="col-12"
      label="Nome"
      maxlength="255"
    />

    <XInput
      v-model="item.description"
      type="textarea"
      class="col-12"
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

    <XBtnGroup
      class="col-12"
      position="left"
    >
      <XBtn
        @click="expand"
        :label="expandedAll ? 'Recolher todos' : 'Expandir todos'"
        size="md"
      />
      <XBtn
        @click="collapse"
        :label="tickedAll ? 'Desmarcar todos' : 'Marcar todos'"
        size="md"
      />
    </XBtnGroup>

    <q-tree
      v-if="!loadingTree"
      v-model:ticked="item.permissions_ids"
      :nodes="permissions"
      ref="treeRef"
      class="col-12"
      node-key="id"
      label-key="description"
      tick-strategy="strict"
    />

    <div
      v-else
      class="col-12 flex flex-center"
    >
      <q-spinner
        class="col-12"
        color="primary"
        size="3em"
      />
    </div>

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
import { computed, onMounted, ref } from 'vue';
import XBtn from 'src/components/buttons/XBtn.vue';
import XInput from 'src/components/inputs/XInput.vue';
import XBtnGroup from 'src/components/others/XBtnGroup.vue';
import notify from 'src/composables/notify';
import { api } from 'src/boot/axios';
import XGroup from 'src/components/others/XGroup.vue';
import XSelectEnum from 'src/components/inputs/XSelectEnum.vue';

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

const treeRef = ref(null);
const expandedAll = ref(false);
const tickedAll = ref(false);
const permissions = ref([]);

const rootNodes = computed(() => {
  const nodes = [];
  const loop = (array) => {
    array.forEach((item) => {
      if ('id' in item) nodes.push(item.id);
      if ('children' in item) loop(item.children);
    });
  };
  loop(permissions.value);
  return nodes;
});

const expand = () => {
  if (expandedAll.value) {
    treeRef.value.collapseAll();
    expandedAll.value = false;
  } else {
    treeRef.value.expandAll();
    expandedAll.value = true;
  }
};

const collapse = () => {
  if (tickedAll.value) {
    item.value.permissions_ids = [];
    tickedAll.value = false;
  } else {
    item.value.permissions_ids = rootNodes.value;
    tickedAll.value = true;
  }
};

const loadingTree = ref(false);
const getPermissions = async () => {
  try {
    loadingTree.value = true;
    const response = await api({ url: '/api/unsafe/permissions-tree' });
    permissions.value = response.data;
  } catch (error) {
    notify.error(error);
  } finally {
    loadingTree.value = false;
  }
};

onMounted(() => {
  getPermissions();
});
</script>
