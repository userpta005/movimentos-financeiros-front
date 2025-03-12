<style lang="scss" scoped>
.q-separator {
  background-color: white !important;
}
</style>

<template>
  <q-drawer
    @mouseover="setting.miniModeIsActive = false"
    :mini="setting.miniModeIsActive"
    :breakpoint="1200"
    :width="270"
    class="bg-primary text-white"
    ref="drawerRef"
    side="left"
    bordered
  >
    <XBtn
      :to="{ name: 'painel' }"
      class="flex flex-center q-pa-md"
      flat
    >
      <q-circular-progress
        v-if="loading"
        indeterminate
        rounded
        size="30px"
        color="white"
        class="q-ma-md"
      />
      <img
        v-else
        :src="imageUrl ?? logoDefault"
        :style="styledMode"
        :class="setting.miniModeIsActive ? '' : 'fit'"
      />
    </XBtn>

    <q-separator class="q-my-md" />

    <q-list>
      <!-- PAINEL -->
      <q-item
        v-if="auth.hasPermission('painel_page')"
        :to="{ name: 'painel' }"
        active-class="bg-secondary"
        clickable
      >
        <q-item-section avatar>
          <q-icon name="mdi-home" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Painel</q-item-label>
        </q-item-section>
      </q-item>

      <!-- CADASTROS -->
      <q-expansion-item
        v-if="auth.hasPermissions(['users_page', 'roles_page', 'categories_page', 'movements'])"
        :content-inset-level="0.5"
        :ref="(el) => (items['registrations'] = el)"
        icon="mdi-folder"
        label="Cadastros"
        group="somegroup"
      >
        <q-list>
          <!-- USERS -->
          <q-item
            v-if="auth.hasPermission('users_page')"
            :to="{ name: 'registrations.users' }"
            active-class="bg-secondary"
            clickable
          >
            <q-item-section avatar>
              <q-icon name="mdi-account-circle" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Usuários</q-item-label>
            </q-item-section>
          </q-item>

          <!-- ATRIBUIÇÕES -->
          <q-item
            v-if="auth.hasPermission('roles_page')"
            :to="{ name: 'registrations.roles' }"
            active-class="bg-secondary"
            clickable
          >
            <q-item-section avatar>
              <q-icon name="mdi-account-lock" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Funções</q-item-label>
            </q-item-section>
          </q-item>

          <!-- CATEGORIES -->
          <q-item
            v-if="auth.hasPermission('categories_page')"
            :to="{ name: 'registrations.categories' }"
            active-class="bg-secondary"
            clickable
          >
            <q-item-section avatar>
              <q-icon name="mdi-tag" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Categorias</q-item-label>
            </q-item-section>
          </q-item>

          <!-- MOVEMENTS -->
          <q-item
            v-if="auth.hasPermission('movements_page')"
            :to="{ name: 'registrations.movements' }"
            active-class="bg-secondary"
            clickable
          >
            <q-item-section avatar>
              <q-icon name="mdi-cash-register" />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                Movimentos<br />
                Financeiros
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-expansion-item>
    </q-list>

    <q-separator class="q-my-md" />

    <div
      class="q-mini-drawer-hide absolute"
      style="top: 10px; right: -45px"
    >
      <q-btn
        @click="setting.miniModeIsActive = true"
        :icon="setting.miniModeIsActive ? 'chevron_right' : 'chevron_left'"
        color="secondary"
        dense
        round
        push
      />
    </div>
  </q-drawer>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import XBtn from 'src/components/buttons/XBtn.vue';
import { useRoute } from 'vue-router';
import { useSettingStore } from 'src/stores/setting';

const setting = useSettingStore();
const route = useRoute();
const auth = useAuthStore();
const drawerRef = ref();
const items = ref({});
const loading = ref(false);

const logoDefault = computed(() => (setting.miniModeIsActive ? '/images/logo-mini.png' : '/images/logo.png'));
const logoNormal = ref();
const logoMiniature = ref();

onMounted(async () => {
  if (!setting.miniModeIsActive) {
    switch (route.name.split('.')[0]) {
      case 'registrations':
        items.value['registrations'].show();
        break;
    }
  }
});

const imageUrl = computed(() => {
  if (setting.miniModeIsActive && logoMiniature.value) {
    return logoMiniature.value;
  }

  if (logoNormal.value) {
    return logoNormal.value;
  }

  return null;
});

const styledMode = computed(() => {
  if (setting.miniModeIsActive) {
    return 'width:50px;height:50px;border-radius:25px;';
  }

  return 'max-height:67px; max-width:237px;';
});
</script>
