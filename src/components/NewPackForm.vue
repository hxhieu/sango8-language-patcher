<template>
  <Dialog v-model:visible="visible" :modal="true" header="Add new pack">
    <div class="new-pack-form">
      <div class="form-section">
        <div class="form-section form-control">
          <label class="form-control">Name</label>
          <InputText class="form-control" />
        </div>
        <div class="form-section form-control">
          <label class="form-control">Language</label>
          <AutoComplete
            class="form-control lang-list"
            :suggestions="filteredLanguages"
            scrollHeight="200px"
            :dropdown="true"
            field="value"
            v-model="selectedValue"
            @complete="searchLanguage($event)"
          >
            <template #item="slotProps">
              <label
                >{{ slotProps.data.value }} - {{ slotProps.data.text }}</label
              >
            </template>
          </AutoComplete>
        </div>
      </div>
    </div>
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        @click="visible = false"
        class="p-button-text"
      />
      <Button label="Create" icon="pi pi-check" @click="onSave" />
    </template>
  </Dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';

import Dialog from 'primevue/dialog';
import AutoComplete from 'primevue/autocomplete';

export default defineComponent({
  name: 'NewPackForm',
  components: {
    Dialog,
    AutoComplete,
  },
  props: {
    show: {
      type: Boolean,
    },
    languages: {
      type: Object,
    },
  },
  emits: ['save'],
  setup(props, { emit }) {
    const visible = ref();
    const visibleProp = computed(() => props.show);
    const supportLanguages = computed<any[]>(() => {
      const result: any = [];
      const { languages } = props;
      if (languages) {
        Object.keys(languages).forEach(x =>
          result.push({
            value: x,
            text: `${x} - ${languages[x]}`,
          }),
        );
      }
      return result;
    });

    const filteredLanguages = ref();

    const selectedValue = ref();

    const onSave = () => {
      emit('save');
    };

    const searchLanguage = ({ query }: { query: string }) => {
      filteredLanguages.value = supportLanguages.value.filter(
        x => x.value === query,
      );
    };

    watch(
      visibleProp,
      value => {
        visible.value = value;
      },
      { immediate: true },
    );

    return {
      visible,
      onSave,
      filteredLanguages,
      selectedValue,
      searchLanguage,
    };
  },
});
</script>

<style lang="scss" scoped>
.new-pack-form {
  height: 50vh;
  align-items: flex-start;
  .lang-list {
    width: 300px;
  }
}
</style>
