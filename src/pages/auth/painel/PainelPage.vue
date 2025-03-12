<template>
  <XPage>
    <div class="row q-gap-xl">
      <XPageTitle
        label="PAINEL"
        class="col-12 text-center"
      />

      <XPageSubtitle
        :label="auth.user.gender === 1 ? `Olá Sr. ${auth.user.name}, seja bem vindo!` : `Olá Sra. ${auth.user.name}, seja bem vinda!`"
        class="col-12 text-center"
      />
    </div>
  </XPage>
</template>

<script setup lang="ts">
import XPage from 'src/components/others/XPage.vue';
import { useAuthStore } from 'src/stores/auth';
import XPageTitle from 'src/components/others/XPageTitle.vue';
import XPageSubtitle from 'src/components/others/XPageSubtitle.vue';

const auth = useAuthStore();
</script>
