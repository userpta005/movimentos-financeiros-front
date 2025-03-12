<template>
  <q-dialog
    @hide="onDialogHide"
    ref="dialogRef"
  >
    <q-card :style="modal.sizes.md">
      <q-card-section class="row no-wrap justify-between">
        <XTitle label="Editar Usuário" />
        <XBtnTopCloseModal @click="onDialogCancel" />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit="submit()">
          <FormDialog
            v-model="item"
            :loading="loading"
          />
        </q-form>
      </q-card-section>
      <q-inner-loading
        :showing="innerLoading"
        label="Por favor, aguarde..."
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar';
import { api } from 'src/boot/axios';
import notify from 'src/composables/notify';
import { computed, onMounted, ref } from 'vue';
import FormDialog from './FormDialog.vue';
import XBtnTopCloseModal from 'src/components/buttons/XBtnTopCloseModal.vue';
import XTitle from 'src/components/others/XTitle.vue';
import { useModalStore } from 'src/stores/modal';

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const props = defineProps({
  tableRef: {
    type: Object,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
});

const modal = useModalStore();

const item = ref({
  id: undefined,
  code: undefined,
  name: undefined,
  surname: undefined,
  email: undefined,
  gender: undefined,
  status: undefined,
  roles_ids: [],
});

const loading = ref(false);
const submit = async () => {
  try {
    loading.value = true;
    const response = await api({
      method: 'put',
      url: `/api/users/${props.id}`,
      data: item.value,
    });
    props.tableRef.requestServerInteraction();
    notify.success(response.message);
    onDialogOK();
  } catch (error) {
    notify.error(error);
  } finally {
    loading.value = false;
  }
};

const apiParams = computed(() => {
  const params = {
    select: ['id', 'name', 'surname', 'email', 'gender', 'status'],
    with: ['roles:id'],
    append: ['roles_ids'],
  };

  return params;
});

const innerLoading = ref(false);
const getItem = async () => {
  try {
    innerLoading.value = true;
    const response = await api({
      url: `/api/unsafe/users/${props.id}`,
      params: apiParams.value,
    });
    item.value = response.data;
  } catch (error) {
    notify.error(error);
  } finally {
    innerLoading.value = false;
  }
};

onMounted(() => {
  getItem();
});
</script>
