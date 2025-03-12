<template>
  <q-dialog
    @hide="onDialogHide"
    ref="dialogRef"
  >
    <q-card :style="modal.sizes.md">
      <q-card-section class="row no-wrap justify-between">
        <XTitle label="Visualizar Usuário" />
        <XBtnTopCloseModal @click="onDialogCancel" />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <XGroup>
          <XField
            :value="item.name"
            class="col-md-6 col-xs-12"
            label="Nome"
          />

          <XField
            :value="item.surname"
            class="col-md-6 col-xs-12"
            label="Sobrenome"
          />

          <XField
            :value="enums.getName('gender', item.gender)"
            class="col-md-6 col-xs-12"
            label="Gênero"
          />

          <XField
            :value="enums.getName('users.user-status', item.status)"
            class="col-md-6 col-xs-12"
            label="Status"
          />

          <XField
            :value="item.email"
            class="col-md-6 col-xs-12"
            label="Email"
          />

          <XField
            :value="item.roles?.map((item) => item.name)"
            class="col-md-6 col-xs-12"
            label="Funções"
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
import { useEnumsStore } from 'src/stores/enums';
import XTitle from 'src/components/others/XTitle.vue';
import helpers from 'src/composables/helpers';
import XGroup from 'src/components/others/XGroup.vue';
import { useModalStore } from 'src/stores/modal';

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
  code: undefined,
  name: undefined,
  surname: undefined,
  email: undefined,
  gender: undefined,
  status: undefined,
  created_by: undefined,
  updated_by: undefined,
  created_at: undefined,
  updated_at: undefined,
  roles: [],
});

const apiParams = computed(() => {
  const params = {
    select: ['id', 'name', 'surname', 'email', 'gender', 'status', 'created_by', 'updated_by', 'created_at', 'updated_at'],
    with: ['createdBy:id,name,surname', 'updatedBy:id,name,surname', 'roles:id,name'],
  };

  return params;
});

const innerLoading = ref(false);
const getItem = async () => {
  try {
    innerLoading.value = true;
    const response = await api({
      url: `/api/users/${props.id}`,
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
