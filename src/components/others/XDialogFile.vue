<template>
  <q-dialog
    @hide="onDialogHide"
    ref="dialogRef"
  >
    <q-card :style="modal.sizes.sm">
      <q-card-section class="row no-wrap justify-between">
        <XTitle label="Arquivos" />
        <XBtnTopCloseModal @click="onDialogCancel" />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <XGroup>
          <div
            v-if="innerLoaded && archives.length > 0"
            class="col-12 row q-gap-sm"
          >
            <q-card
              v-for="(item, key) in archives"
              :key="key"
              class="col-12 bg-primary"
              style="position: relative"
              bordered
            >
              <q-card-section>
                <div class="text-secondary">{{ item.name }}</div>
                <div class="text-white">Tamanho: {{ (item.size / 1024).toFixed(2) }} KB</div>
                <div class="text-white">Inserido às: {{ helpers.brDateTime(item.created_at) }}</div>
                <div class="text-white">Inserido pelo usuário: {{ item.created_by?.full_name }}</div>
              </q-card-section>
              <XBtnGroup :style="{ position: 'absolute', top: '5px', right: '5px' }">
                <XBtn
                  @click="downloadFile(item.archive_url, item.name, key)"
                  :loading="downloadLoading[key]"
                  tooltip-label="Baixar"
                  icon="download"
                  color="secondary"
                  dense
                />
                <XBtn
                  v-if="!viewable"
                  @click="deleteFile(item.id, key)"
                  :loading="loading[key]"
                  tooltip-label="Excluir"
                  icon="mdi-trash-can-outline"
                  color="red"
                  dense
                />
              </XBtnGroup>
            </q-card>
          </div>
          <XSubtitle
            v-if="innerLoaded && archives.length === 0"
            class="col-12 text-center"
            label="Sem arquivos salvos."
          />
          <XBtnGroup
            class="col-12"
            position="right"
          >
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
import { onMounted, ref } from 'vue';
import XBtn from '../buttons/XBtn.vue';
import notify from 'src/composables/notify';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';
import XGroup from '../others/XGroup.vue';
import XBtnGroup from '../others/XBtnGroup.vue';
import { useDialogPluginComponent } from 'quasar';
import { useModalStore } from 'src/stores/modal';
import XTitle from './XTitle.vue';
import XBtnTopCloseModal from 'src/components/buttons/XBtnTopCloseModal.vue';
import helpers from 'src/composables/helpers';
import XBtnBottomCloseModal from '../buttons/XBtnBottomCloseModal.vue';
import XSubtitle from './XSubtitle.vue';

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent();

const props = defineProps({
  prefix: {
    type: String,
    required: true,
  },
  archiveable_type: {
    type: String,
    required: true,
  },
  archiveable_id: {
    type: Number,
    required: false,
  },
  viewable: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const $q = useQuasar();
const modal = useModalStore();
const archives = ref([]);

const loading = ref([]);
const deleteFile = (id, key) => {
  $q.dialog({
    title: 'Excluir Arquivo',
    message: 'Tem certeza que deseja excluir este arquivo?',
    cancel: true,
    ok: true,
  }).onOk(async () => {
    try {
      loading.value[key] = true;
      const response = await api({
        method: 'delete',
        url: `/api/unsafe/archives/${id}`,
      });
      archives.value = archives.value.filter((vl) => vl.id != id);
      notify.success(response.message);
    } catch (error) {
      notify.error(error);
    } finally {
      loading.value[key] = false;
    }
  });
};

const innerLoaded = ref(false);
const innerLoading = ref(false);
const getItem = async () => {
  try {
    innerLoading.value = true;
    const response = await api({
      url: '/api/unsafe/archives',
      params: {
        select: ['id', 'prefix', 'name', 'path', 'extension', 'size', 'archiveable_type', 'archiveable_id', 'created_by', 'created_at'],
        with: ['createdBy:id,name,surname'],
        prefix: props.prefix,
        archiveable_type: props.archiveable_type,
        archiveable_id: props.archiveable_id,
      },
    });
    archives.value = response.data;
  } catch (error) {
    notify.error(error);
  } finally {
    innerLoaded.value = true;
    innerLoading.value = false;
  }
};

const downloadLoading = ref([]);
const downloadFile = async (fileUrl, fileName, key) => {
  try {
    downloadLoading.value[key] = true;
    await helpers.downloadFile(fileUrl, fileName);
  } catch (error) {
    notify.error(error);
  } finally {
    downloadLoading.value[key] = false;
  }
};

onMounted(() => {
  getItem();
});
</script>
