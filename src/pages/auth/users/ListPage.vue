<template>
  <XPage>
    <XContentPage>
      <template #header>
        <XPageTitle
          label="USUÁRIOS"
          class="text-center"
        />
      </template>

      <template #filter>
        <XGroup>
          <XInputSearch
            v-model="filter"
            class="col-md-3 col-xs-12"
            dense
          />
          <XInputDate
            v-model="created_at"
            @watch="watchCreatedAt"
            class="col-md-3 col-xs-12"
            label="Criado em"
            dense
          />
          <XSelectChipEnum
            v-model="status"
            class="col-md-3 col-xs-12"
            label="Status"
            enum-name="users.user-status"
            dense
          />
        </XGroup>
      </template>

      <template #content>
        <q-table
          v-model:pagination="pagination"
          @request="getItems"
          :columns="columns"
          :rows="rows"
          :rows-per-page-options="rowsPerPageOptions"
          :visible-columns="visibleColumns"
          :loading="loading"
          ref="tableRef"
          row-key="id"
          bordered
          dense
        >
          <template #top>
            <div class="q-pa-xs row q-gutter-sm">
              <XBtn
                v-if="auth.hasPermission('users_create')"
                @click="$q.dialog({ component: AddDialog, componentProps: { tableRef: tableRef } })"
                label="Cadastrar usuário"
              />
            </div>
          </template>
          <template #body-cell-actions="props">
            <q-td :props="props">
              <div class="row no-wrap q-gutter-xs">
                <XBtnView
                  v-if="auth.hasPermission('users_view')"
                  @click="
                    $q.dialog({
                      component: ViewDialog,
                      componentProps: { id: props.row.id },
                    })
                  "
                />
                <XBtnEdit
                  v-if="auth.hasPermission('users_edit')"
                  @click="
                    $q.dialog({
                      component: EditDialog,
                      componentProps: { tableRef: tableRef, id: props.row.id },
                    })
                  "
                />
                <XBtnDelete
                  v-if="auth.hasPermission('users_delete')"
                  @click="
                    $q.dialog({
                      component: DestroyDialog,
                      componentProps: { tableRef: tableRef, id: props.row.id },
                    })
                  "
                />
              </div>
            </q-td>
          </template>
        </q-table>
      </template>
    </XContentPage>
  </XPage>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth';
import { useEnumsStore } from 'src/stores/enums';
import { computed, onMounted, ref, watch } from 'vue';
import XInputDate from 'src/components/inputs/XInputDate.vue';
import { useQuasar } from 'quasar';
import AddDialog from './dialogs/AddDialog.vue';
import XBtnEdit from 'src/components/buttons/XBtnEdit.vue';
import EditDialog from './dialogs/EditDialog.vue';
import helpers from 'src/composables/helpers';
import DestroyDialog from './dialogs/DestroyDialog.vue';
import XBtnDelete from 'src/components/buttons/XBtnDelete.vue';
import ViewDialog from './dialogs/ViewDialog.vue';
import XBtnView from 'src/components/buttons/XBtnView.vue';
import XPage from 'src/components/others/XPage.vue';
import XInputSearch from 'src/components/inputs/XInputSearch.vue';
import XBtn from 'src/components/buttons/XBtn.vue';
import XSelectChipEnum from 'src/components/inputs/XSelectChipEnum.vue';
import XContentPage from 'src/components/others/XContentPage.vue';
import XPageTitle from 'src/components/others/XPageTitle.vue';
import { api } from 'src/boot/axios';
import notify from 'src/composables/notify';
import XGroup from 'src/components/others/XGroup.vue';

const $q = useQuasar();
const auth = useAuthStore();
const enums = useEnumsStore();

const tableRef = ref();
const rows = ref([]);
const rowsPerPageOptions = ref([5, 10, 15, 20, 25, 50, 100]);
const pagination = ref({
  page: 1,
  rowsPerPage: 25,
  rowsNumber: 10,
  sortBy: 'id',
  descending: true,
});
const columns = [
  {
    label: 'ID',
    name: 'id',
    field: 'id',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Nome Completo',
    name: 'name',
    field: 'full_name',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Email',
    name: 'email',
    field: 'email',
    align: 'left',
    sortable: true,
  },
  {
    label: 'Gênero',
    name: 'gender',
    field: 'gender',
    align: 'left',
    sortable: true,
    format: (val) => enums.getName('gender', val),
  },
  {
    label: 'Status',
    name: 'status',
    field: 'status',
    align: 'left',
    sortable: true,
    format: (val) => enums.getName('users.user-status', val),
  },
  {
    label: 'Criado em',
    name: 'created_at',
    field: 'created_at',
    align: 'left',
    sortable: true,
    format: (val) => helpers.brDateTime(val),
  },
  {
    label: 'Editado em',
    name: 'updated_at',
    field: 'updated_at',
    align: 'left',
    sortable: true,
    format: (val) => helpers.brDateTime(val),
  },
  {
    label: 'Ações',
    name: 'actions',
    field: 'actions',
    align: 'left',
  },
];

const visibleColumns = computed(() => {
  var arr = columns.map((column) => column.name);

  if (!auth.hasPermissions(['users_view', 'users_edit', 'users_delete'])) {
    arr = arr.filter((column) => column !== 'actions');
  }

  return arr;
});

const filter = ref();
const created_at = ref();
const status = ref([]);

const apiParams = computed(() => {
  const params = {
    select: ['id', 'name', 'surname', 'email', 'gender', 'status', 'created_at', 'updated_at'],
    search: filter.value,
    whereCreatedAt: created_at.value,
    filterByStatus: status.value,
  };

  return params;
});

const loading = ref(false);
const getItems = async (scope) => {
  try {
    const { page, rowsPerPage, sortBy, descending } = scope.pagination;
    loading.value = true;
    const response = await api({
      url: '/api/users',
      params: {
        ...apiParams.value,
        paginate: {
          page: page,
          perPage: rowsPerPage,
        },
        sortBy: {
          column: sortBy,
          direction: descending ? 'desc' : 'asc',
        },
      },
    });
    pagination.value = {
      page: response.data.current_page,
      rowsPerPage: response.data.per_page,
      rowsNumber: response.data.total,
      sortBy: sortBy,
      descending: descending,
    };
    rows.value = response.data.data;
  } catch (error) {
    notify.error(error);
  } finally {
    loading.value = false;
  }
};

const watchCreatedAt = () => tableRef.value.requestServerInteraction();
watch([filter, status], () => tableRef.value.requestServerInteraction());

onMounted(() => {
  tableRef.value.requestServerInteraction();
});
</script>
