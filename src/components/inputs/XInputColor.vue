<template>
  <XInput
    v-model="value"
    ref="inputRef"
    label="Cor"
    data-maska="!#HHHHHH"
    data-maska-tokens="H:[0-9a-fA-F]"
    v-maska
    dense
  >
    <q-popup-proxy
      ref="popupRef"
      transition-show="scale"
      transition-hide="scale"
      cover
    >
      <div class="row justify-end">
        <XBtn
          @click="confirm"
          tooltip-label="Confirmar"
          icon="mdi-check"
          dense
          flat
        />
        <q-color
          v-model="value"
          class="col-12"
        />
      </div>
    </q-popup-proxy>
    <template #prepend>
      <q-icon
        name="colorize"
        class="cursor-pointer"
      />
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
  </XInput>
</template>

<script setup>
import XInput from 'src/components/inputs/XInput.vue';
import { vMaska } from 'maska';
import { computed, ref, useSlots } from 'vue';
import XBtn from 'src/components/buttons/XBtn.vue';

const slots = useSlots();

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
  },
});

const emit = defineEmits(['update:modelValue', 'confirmed']);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const popupRef = ref();

const confirm = () => {
  emit('confirmed');
  popupRef.value.hide();
};

const inputRef = ref();
defineExpose({
  focus: () => {
    inputRef.value?.focus();
    popupRef.value.show();
  },
});
</script>
