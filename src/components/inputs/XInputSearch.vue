<template>
  <XInput
    placeholder="Pesquisar..."
    debounce="300"
  >
    <template #append>
      <q-icon name="search" />
    </template>
  </XInput>
</template>

<script setup>
import XInput from 'src/components/inputs/XInput.vue';
</script>
