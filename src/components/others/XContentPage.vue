<template>
  <div class="row q-gap-xl">
    <div
      v-if="slots.header"
      class="col-12"
    >
      <slot name="header"></slot>
    </div>

    <q-card
      v-if="slots.filter"
      class="col-12"
      bordered
    >
      <q-card-section>
        <XTitle label="Filtros" />
      </q-card-section>
      <q-card-section>
        <slot name="filter"></slot>
      </q-card-section>
    </q-card>

    <div
      v-if="slots.content"
      class="col-12"
    >
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup>
import { useSlots } from 'vue';
import XTitle from './XTitle.vue';

const slots = useSlots();
</script>
