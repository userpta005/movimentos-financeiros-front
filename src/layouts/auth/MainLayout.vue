<template>
  <q-layout view="hHh lpR fFf">
    <q-header
      class="bg-primary text-white"
      elevated
    >
      <q-toolbar class="q-gap-xs">
        <q-btn
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          dense
          flat
          round
        />

        <q-separator
          color="white"
          vertical
          inset
        />

        <q-toolbar-title
          class="flex flex-center"
          shrink
        >
          <img
            :src="$q.dark.isActive ? '/images/logo.png' : '/images/logo.png'"
            style="max-height: 40px"
            class="fit"
          />
        </q-toolbar-title>

        <q-space />

        <XBtnGroup
          class="q-py-xs"
          size="q-gap-xs"
        >
          <q-btn
            @click="darkMode.toggleDarkMode()"
            :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
            color="white"
            text-color="black"
            dense
            push
          >
            <XTooltip :label="$q.dark.isActive ? 'Sair do modo escuro' : 'Colocar em modo escuro'" />
          </q-btn>

          <q-btn
            @click="logout"
            :loading="btnLogoutLoading"
            icon="mdi-logout"
            color="white"
            text-color="black"
            dense
            push
          >
            <XTooltip label="Sair" />
          </q-btn>
        </XBtnGroup>
      </q-toolbar>
    </q-header>

    <XDrawer v-model="leftDrawerOpen" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import XDrawer from 'src/components/layouts/XDrawer.vue';
import { useSettingStore } from 'src/stores/setting';
import { useAuthStore } from 'src/stores/auth';
import { useQuasar } from 'quasar';
import XTooltip from 'src/components/others/XTooltip.vue';
import XBtnGroup from 'src/components/others/XBtnGroup.vue';

const leftDrawerOpen = ref(true);
const darkMode = useSettingStore();
darkMode.boot();

const auth = useAuthStore();

const $q = useQuasar();

const btnLogoutLoading = ref(false);
const logout = async () => {
  $q.loading.show();
  await auth.logout();
  $q.loading.hide();
};

onMounted(() => {
  auth.syncAuth();
});
</script>
