<template>
  <q-dialog
    @hide="onDialogHide"
    ref="dialogRef"
  >
    <q-card :style="modal.sizes.sm">
      <q-card-section class="row no-wrap justify-between">
        <XTitle label="Cadastrar Movimento Financeiro" />
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
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar';
import { api } from 'src/boot/axios';
import notify from 'src/composables/notify';
import { ref } from 'vue';
import FormDialog from './FormDialog.vue';
import XBtnTopCloseModal from 'src/components/buttons/XBtnTopCloseModal.vue';
import XTitle from 'src/components/others/XTitle.vue';
import { useModalStore } from 'src/stores/modal';
import helpers from 'src/composables/helpers';

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const props = defineProps({
  tableRef: {
    type: Object,
    required: true,
  },
});

const modal = useModalStore();
const item = ref({
  type: undefined,
  value: 0,
  category_id: undefined,
  description: undefined,
  is_active: 1,
});

const loading = ref(false);
const submit = async () => {
  try {
    loading.value = true;
    let form = { ...item.value };
    form.value = helpers.moneyToFloat(form.value);
    const response = await api({
      method: 'post',
      url: '/api/movements',
      data: form,
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
</script>
