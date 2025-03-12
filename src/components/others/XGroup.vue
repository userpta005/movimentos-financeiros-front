<template>
  <div>
    <div
      :class="[size]"
      class="row"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    required: false,
    default: 'q-col-gutter-md',
  },
});
</script>
