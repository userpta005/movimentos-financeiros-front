<template>
  <q-dialog
    @hide="onDialogHide"
    ref="dialogRef"
  >
    <q-card :style="modal.sizes.sm">
      <q-card-section class="row no-wrap justify-between">
        <XTitle label="Editar Movimento Financeiro" />
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
import helpers from 'src/composables/helpers';

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
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
      method: 'put',
      url: `/api/movements/${props.id}`,
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

const apiParams = computed(() => {
  const params = {
    select: ['id', 'type', 'value', 'category_id', 'description', 'is_active'],
  };

  return params;
});

const innerLoading = ref(false);
const getItem = async () => {
  try {
    innerLoading.value = true;
    const response = await api({
      url: `/api/unsafe/movements/${props.id}`,
      params: apiParams.value,
    });
    item.value = response.data;
    item.value.value = helpers.floatToMoney(response.data.value);
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
