<style lang="scss" scoped>
.q-field :deep(.q-field__label) {
  padding-left: 12px;
  padding-right: 12px;
}
.q-field :deep(.q-field__control) {
  padding: 0px;
}
.q-field :deep(.q-field__control-container) {
  padding-top: 30px;
}
.q-field :deep(.ql-toolbar) {
  border: 0px;
}
.q-field :deep(.ql-editor) {
  min-height: 200px;
  cursor: text;
}
.q-field :deep(.ql-container) {
  border: 0px;
  width: 100%;
  height: auto;
}
</style>

<template>
  <q-field
    v-model="value"
    lazy-rules="ondemand"
    hide-bottom-space
    outlined
    stack-label
    no-error-icon
  >
    <template #control>
      <QuillEditor
        v-model:content="value"
        contentType="html"
        theme="snow"
        toolbar="#toolbar"
      >
        <template #toolbar>
          <XEditorToolbar />
        </template>
      </QuillEditor>
    </template>
    <template
      v-for="(_, slot) in slots"
      :key="slot"
      #[slot]="scope"
    >
      <slot
        :name="slot"
        v-bind="scope"
        :key="slot"
      />
    </template>
  </q-field>
</template>

<script setup>
import { computed, useSlots } from 'vue';
import XEditorToolbar from './XEditorToolbar.vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';

const slots = useSlots();

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
</script>
