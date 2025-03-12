<template>
  <div
    class="column q-gap-md q-mt-md"
    style="max-width: 400px; margin-left: auto; margin-right: auto"
  >
    <q-btn
      @click="checkPasswordWithPrompt"
      label="Inserir Senha"
      color="red"
      no-caps
    />
    <q-btn
      @click="migrate"
      :loading="loading[0]"
      label="Migrate"
      color="primary"
      no-caps
    />
    <q-btn
      @click="dbSeed"
      :loading="loading[1]"
      label="DB Seed"
      color="primary"
      no-caps
    />
    <q-btn
      @click="defenderSeeder"
      :loading="loading[2]"
      label="Defender Seeder"
      color="primary"
      no-caps
    />
    <q-btn
      @click="optimizeClear"
      :loading="loading[3]"
      label="Optimize Clear"
      color="primary"
      no-caps
    />
    <q-btn
      @click="optimize"
      :loading="loading[4]"
      label="Optimize"
      color="primary"
      no-caps
    />
    <q-btn
      @click="composerInstallNoDev"
      :loading="loading[5]"
      label="Composer Install NoDev"
      color="primary"
      no-caps
    />
    <q-btn
      @click="composerDumpAutoload"
      :loading="loading[6]"
      label="Composer Dump Autoload"
      color="primary"
      no-caps
    />
  </div>
</template>

<script setup>
import notify from 'src/composables/notify';
import { api } from 'src/boot/axios';
import { ref } from 'vue';

const inputPassword = ref();
const loading = ref([false, false, false, false, false, false, false, false, false]);

const checkPasswordWithPrompt = () => {
  inputPassword.value = window.prompt('Insira a senha:');
};

const migrate = async () => {
  try {
    loading.value[0] = true;
    const response = await api({
      method: 'post',
      url: '/api/artisan/migrate',
      params: { password: inputPassword.value },
    });
    loading.value[0] = false;
    notify.success(response.message);
  } catch (error) {
    loading.value[0] = false;
    notify.error(error);
  }
};

const dbSeed = async () => {
  try {
    loading.value[1] = true;
    const response = await api({
      method: 'post',
      url: '/api/artisan/db-seed',
      params: { password: inputPassword.value },
    });
    loading.value[1] = false;
    notify.success(response.message);
  } catch (error) {
    loading.value[1] = false;
    notify.error(error);
  }
};

const defenderSeeder = async () => {
  try {
    loading.value[2] = true;
    const response = await api({
      method: 'post',
      url: '/api/artisan/defender-seeder',
      params: { password: inputPassword.value },
    });
    loading.value[2] = false;
    notify.success(response.message);
  } catch (error) {
    loading.value[2] = false;
    notify.error(error);
  }
};

const optimizeClear = async () => {
  try {
    loading.value[3] = true;
    const response = await api({
      method: 'post',
      url: '/api/artisan/optimize-clear',
      params: { password: inputPassword.value },
    });
    loading.value[3] = false;
    notify.success(response.message);
  } catch (error) {
    loading.value[3] = false;
    notify.error(error);
  }
};

const optimize = async () => {
  try {
    loading.value[4] = true;
    const response = await api({
      method: 'post',
      url: '/api/artisan/optimize',
      params: { password: inputPassword.value },
    });
    loading.value[4] = false;
    notify.success(response.message);
  } catch (error) {
    loading.value[4] = false;
    notify.error(error);
  }
};

const composerInstallNoDev = async () => {
  try {
    loading.value[5] = true;
    const response = await api({
      method: 'post',
      url: '/api/artisan/composer-install',
      params: { password: inputPassword.value },
    });
    loading.value[5] = false;
    notify.success(response.message);
  } catch (error) {
    loading.value[5] = false;
    notify.error(error);
  }
};

const composerDumpAutoload = async () => {
  try {
    loading.value[6] = true;
    const response = await api({
      method: 'post',
      url: '/api/artisan/composer-dump-autoload',
      params: { password: inputPassword.value },
    });
    loading.value[6] = false;
    notify.success(response.message);
  } catch (error) {
    loading.value[6] = false;
    notify.error(error);
  }
};
</script>
