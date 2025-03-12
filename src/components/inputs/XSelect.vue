<template>
  <q-select
    v-model="value"
    @filter="fetchWhenSearch"
    @focus="fetchOptionsWhenFocused"
    :options="optionsFiltered"
    :option-label="optionLabel"
    :option-value="optionValue"
    :loading="loading"
    :use-input="useFilter"
    ref="select"
    lazy-rules="ondemand"
    hide-bottom-space
    emit-value
    map-options
    outlined
  >
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
  </q-select>
</template>

<script setup>
import { api } from 'src/boot/axios';
import notify from 'src/composables/notify';
import { computed, onMounted, ref, useSlots, watch } from 'vue';

const slots = useSlots();

const props = defineProps({
  modelValue: {
    required: true,
  },
  options: {
    type: Array,
    required: false,
    default: () => {
      return [];
    },
  },
  optionLabel: {
    type: String,
    required: false,
    default: 'name',
  },
  optionValue: {
    type: String,
    required: false,
    default: 'id',
  },
  useFilter: {
    type: Boolean,
    required: false,
    default: false,
  },
  usePreOption: {
    type: Boolean,
    required: false,
    default: false,
  },
  preOptionLabel: {
    type: String,
    required: false,
    default: 'Selecione uma opção...',
  },
  apiUrl: {
    type: String,
    required: false,
  },
  apiArgs: {
    type: Object,
    required: false,
    default: () => {
      return {};
    },
  },
  fetchWhenSearch: {
    type: Boolean,
    required: false,
    default: false,
  },
  fetchWhenMounted: {
    type: Boolean,
    required: false,
    default: false,
  },
  fetchWhenFocused: {
    type: Boolean,
    required: false,
    default: false,
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

const select = ref();

const loading = ref(false);

const focused = ref(false);

const hydrated = ref(false);

const preOption = computed(() => [{ id: null, [props.optionLabel]: props.preOptionLabel }]);

const optionsWithPreOptionIncluded = computed(() => (props.usePreOption ? preOption.value.concat(props.options) : props.options));

const optionsDefault = ref(optionsWithPreOptionIncluded.value);

const optionsFiltered = ref(optionsWithPreOptionIncluded.value);

watch(
  () => props.options,
  () => {
    optionsDefault.value = optionsWithPreOptionIncluded.value;
    optionsFiltered.value = optionsWithPreOptionIncluded.value;
  }
);

const hasSelectedOptions = computed(() => {
  return (Array.isArray(value.value) && value.value.length > 0) || (!Array.isArray(value.value) && !!value.value);
});

const hydrateSelectedOptions = computed(() => {
  if (!hydrated.value && !focused.value && hasSelectedOptions.value && (props.fetchWhenFocused || props.fetchWhenSearch)) {
    return true;
  }

  return false;
});

const buildConfigApi = (search = null) => {
  let configApi = { url: props.apiUrl, params: { ...props.apiArgs } };

  if (hydrateSelectedOptions.value) {
    configApi.params.whereIn = {
      column: props.optionValue,
      value: Array.isArray(value.value) ? value.value : [value.value],
    };
  }

  if (search) {
    configApi.params.search = search;
  }

  return configApi;
};

const getOpcoes = async () => {
  try {
    loading.value = true;
    let config = buildConfigApi();
    const response = await api(config);
    optionsDefault.value = props.usePreOption ? preOption.value.concat(response.data) : response.data;
    optionsFiltered.value = props.usePreOption ? preOption.value.concat(response.data) : response.data;
  } catch (error) {
    notify.error(error);
  } finally {
    loading.value = false;
  }
};

const fetchOptionsWhenFocused = async () => {
  if (props.fetchWhenFocused && !focused.value) {
    await getOpcoes();
    focused.value = true;
  }
};

const fetchOptionsWhenMounted = async () => {
  if (props.fetchWhenMounted) {
    await getOpcoes();
  }
};

const hydrationInitiated = ref(false);
const fnHydrateSelectedOptions = async () => {
  if (hydrateSelectedOptions.value && !hydrationInitiated.value) {
    hydrationInitiated.value = true;
    await getOpcoes();
    hydrated.value = true;
  }
};

watch(value, () => fnHydrateSelectedOptions());

onMounted(async () => {
  await fnHydrateSelectedOptions();
  await fetchOptionsWhenMounted();
});

const fetchWhenSearch = async (val, update) => {
  if (val.length <= 0) {
    update(() => {
      optionsFiltered.value = optionsDefault.value;
    });
    return;
  }

  if (props.fetchWhenSearch) {
    try {
      let config = buildConfigApi(val);
      const response = await api(config);
      optionsDefault.value = props.usePreOption ? preOption.value.concat(response.data) : response.data;
      optionsFiltered.value = props.usePreOption ? preOption.value.concat(response.data) : response.data;
    } catch (error) {
      notify.error(error);
      abort();
    }
  }

  update(() => {
    /*
      Antes
      const needle = val.toLowerCase();

      Agora o needle é tratado para remover acentos e caracteres especiais
    */
    const needle = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    /*
      Antes 
      optionsFiltered.value = optionsDefault.value.filter((v) => v[props.optionLabel].toLowerCase().indexOf(needle) > -1);

      Agora o optionLabel é tratado para remover acentos e caracteres especiais
    */

    optionsFiltered.value = optionsDefault.value.filter(
      (v) =>
        v[props.optionLabel]
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .indexOf(needle) > -1
    );
  });
};

defineExpose({
  resetFocused: () => (focused.value = false),
  focus: () => select.value?.focus(),
  hydrateSelectedOptions: () => fnHydrateSelectedOptions(),
  getOptions: () => getOpcoes(),
});
</script>
