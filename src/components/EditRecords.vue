<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :maximizable="true"
    :header="multiEdit ? 'Edit multiple records' : 'Edit record'"
  >
    <div class="text-edit">
      <label>Original</label>
      <Textarea
        rows="5"
        cols="100"
        readonly
        v-model="originalValue"
        class="disabled"
      />
    </div>
    <div class="text-edit">
      <label>Translation</label>
      <Textarea rows="5" cols="100" v-model="textValue" />
    </div>
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        @click="visible = false"
        class="p-button-text"
      />
      <Button label="Append Changes" icon="pi pi-check" @click="onSave" />
    </template>
  </Dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';

import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';

import { TranslationRecord } from '@/interfaces';

export default defineComponent({
  name: 'EditRecords',
  components: {
    Dialog,
    Textarea,
  },
  props: {
    records: {
      type: Array,
    },
    show: {
      type: Boolean,
    },
  },
  emits: ['save'],
  setup(props, { emit }) {
    const visible = ref();
    const visibleProp = computed(() => props.show);
    const model = computed(() => props.records as TranslationRecord[]);

    const originalValue = ref();
    const textValue = ref();

    const multiEdit = computed(() => props.records && props.records.length > 1);

    const onSave = () => {
      const commit = () => {
        emit('save', {
          text: textValue.value,
          original: originalValue.value,
        } as TranslationRecord);
        visible.value = false;
      };
      commit();
    };

    watch(
      visibleProp,
      value => {
        visible.value = value;
      },
      { immediate: true },
    );

    watch(model, value => {
      if (value && value.length > 0) {
        const { original, text } = value[0];
        textValue.value = text;
        originalValue.value = original;
        // Handle multiple values
        if (value.length > 1) {
          if (
            value.filter(x => x.original === originalValue.value).length !==
            model.value.length
          ) {
            // Not the same values
            // then we need to reset the editable
            originalValue.value = '<MULTIPLE VALUES>';
            textValue.value = '';
          }
        }
      }
    });

    return {
      visible,
      textValue,
      originalValue,
      multiEdit,
      onSave,
      model,
    };
  },
});
</script>

<style lang="scss" scoped>
.p-dialog-content {
  .text-edit {
    display: flex;
    flex-direction: column;
    label {
      margin: 20px 0 10px 0;
    }
    textarea.disabled {
      color: var(--text-color);
      background: var(--surface-d);
      &:focus,
      &:hover {
        outline: none;
        border-color: var(--surface-d);
        box-shadow: 0;
      }
    }
  }
}
</style>
