<template>
  <q-dialog
    @hide="onDialogHide"
    ref="dialogRef"
  >
    <q-card :style="modal.sizes.sm">
      <q-card-section class="row no-wrap justify-between">
        <XTitle label="Visualizar Função" />
        <XBtnTopCloseModal @click="onDialogCancel" />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <XGroup>
          <XField
            :value="item.name"
            class="col-md-8 col-xs-12"
            label="Nome"
          />

          <XField
            :value="enums.getName('is-active', item.is_active)"
            class="col-md-4 col-xs-12"
            label="Ativo"
          />

          <XField
            :value="item.description"
            class="col-12"
            label="Descrição"
            type="textarea"
          />

          <XField
            :value="helpers.brDateTime(item.created_at)"
            class="col-md-6 col-xs-12"
            label="Criado em"
          />

          <XField
            :value="helpers.brDateTime(item.updated_at)"
            class="col-md-6 col-xs-12"
            label="Editado em"
          />

          <XField
            :value="item.created_by?.full_name"
            class="col-md-6 col-xs-12"
            label="Criado por"
          />

          <XField
            :value="item.updated_by?.full_name"
            class="col-md-6 col-xs-12"
            label="Editado por"
          />

          <XBtnGroup class="col-12">
            <XBtnBottomCloseModal @click="onDialogCancel" />
          </XBtnGroup>
        </XGroup>
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
import XField from 'src/components/others/XField.vue';
import XBtnTopCloseModal from 'src/components/buttons/XBtnTopCloseModal.vue';
import XBtnBottomCloseModal from 'src/components/buttons/XBtnBottomCloseModal.vue';
import XBtnGroup from 'src/components/others/XBtnGroup.vue';
import XTitle from 'src/components/others/XTitle.vue';
import helpers from 'src/composables/helpers';
import XGroup from 'src/components/others/XGroup.vue';
import { useModalStore } from 'src/stores/modal';
import { useEnumsStore } from 'src/stores/enums';

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent();

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const enums = useEnumsStore();
const modal = useModalStore();

const item = ref({
  id: undefined,
  name: undefined,
  description: undefined,
  is_active: undefined,
  created_by: undefined,
  updated_by: undefined,
  created_at: undefined,
  updated_at: undefined,
});

const apiParams = computed(() => {
  const params = {
    select: ['id', 'name', 'description', 'is_active', 'created_at', 'updated_at', 'created_by', 'updated_by'],
    with: ['createdBy:id,name,surname', 'updatedBy:id,name,surname'],
  };

  return params;
});

const innerLoading = ref(false);
const getItem = async () => {
  try {
    innerLoading.value = true;
    const response = await api({
      url: `/api/roles/${props.id}`,
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
