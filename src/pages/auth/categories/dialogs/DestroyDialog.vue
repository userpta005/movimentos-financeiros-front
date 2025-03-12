<template>
  <q-dialog
    @hide="onDialogHide"
    ref="dialogRef"
  >
    <q-card :style="modal.sizes.xs">
      <q-card-section class="row no-wrap justify-between">
        <XTitle label="Excluir Categoria" />
        <XBtnTopCloseModal @click="onDialogCancel" />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <XSubtitle label="Deseja prosseguir com a exclusão do item abaixo?" />
      </q-card-section>

      <q-card-section>
        <XBtnGroup>
          <XBtnBottomCloseModal @click="onDialogCancel" />
          <XBtnDelete
            @click="onOkClick"
            :loading="loading"
            :dense="false"
          />
        </XBtnGroup>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent } from 'quasar';
import { api } from 'src/boot/axios';
import notify from 'src/composables/notify';
import { ref } from 'vue';
import XBtnTopCloseModal from 'src/components/buttons/XBtnTopCloseModal.vue';
import XBtnBottomCloseModal from 'src/components/buttons/XBtnBottomCloseModal.vue';
import XBtnDelete from 'src/components/buttons/XBtnDelete.vue';
import XBtnGroup from 'src/components/others/XBtnGroup.vue';
import XTitle from 'src/components/others/XTitle.vue';
import XSubtitle from 'src/components/others/XSubtitle.vue';
import { useModalStore } from 'src/stores/modal';

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
const loading = ref(false);

const onOkClick = async () => {
  try {
    loading.value = true;
    const response = await api({
      method: 'delete',
      url: `/api/categories/${props.id}`,
    });
    loading.value = false;
    notify.success(response.message);
    onDialogOK();
    props.tableRef.requestServerInteraction();
  } catch (error) {
    loading.value = false;
    notify.error(error);
  }
};
</script>
