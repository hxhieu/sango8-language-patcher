<template>
  <Dialog v-model:visible="visible" :modal="true" header="Add new pack">
    <div class="new-pack-form">
      <div class="form-section">
        <div class="form-section form-control">
          <label class="form-control">Name</label>
          <InputText class="form-control" v-model="model.name" />
        </div>
        <div class="form-section form-control">
          <label class="form-control">Language</label>
          <Dropdown
            class="form-control lang-list"
            :options="supportLanguages"
            scrollHeight="300px"
            optionValue="value"
            optionLabel="text"
            v-model="model.language"
          />
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
      <Button
        label="Create"
        icon="pi pi-check"
        @click="onSave"
        v-if="isValid"
      />
    </template>
  </Dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';

import Dialog from 'primevue/dialog';

export default defineComponent({
  name: 'NewPackForm',
  components: {
    Dialog,
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

    const model = ref({
      name: '',
      language: '',
    });

    const isValid = computed(
      () => model.value && model.value.name && model.value.language,
    );

    const onSave = () => {
      emit('save', model.value);
      visible.value = false;
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
      model,
      supportLanguages,
      isValid,
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
