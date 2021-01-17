<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :maximizable="true"
    :header="multiEdit ? 'Edit multiple records' : 'Edit record'"
  >
    <div class="text-edit">
      <label>Original</label>
      <Textarea rows="5" cols="100" readonly v-model="originalValue" />
    </div>
    <div class="text-edit">
      <label>Translation</label>
      <Textarea rows="5" cols="100" v-model="textValue" />
    </div>
    <div class="text-edit">
      <label>Notes</label>
      <Textarea rows="1" cols="100" v-model="notesValue" />
    </div>
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        @click="visible = false"
        class="p-button-text"
      />
      <Button label="Save" icon="pi pi-check" @click="onSave" autofocus />
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
    const records = computed(() => props.records as TranslationRecord[]);

    const originalValue = ref();
    const textValue = ref();
    const notesValue = ref();

    const multiEdit = computed(() => props.records && props.records.length > 1);

    const onSave = () => {
      const commit = () => {
        emit('save', {
          text: textValue.value,
          original: originalValue.value,
          notes: notesValue.value,
        } as TranslationRecord);
        visible.value = false;
      };
      commit();
      // if (multiEdit.value) {
      //   confirm.require({
      //     message: 'Are you sure you want to update all the records?',
      //     // header: 'Multiple records are selected',
      //     icon: 'pi pi-exclamation-triangle',
      //     accept: () => {
      //       commit();
      //     },
      //   });
      // } else {
      //   commit();
      // }
    };

    watch(
      visibleProp,
      value => {
        visible.value = value;
      },
      { immediate: true },
    );

    watch(records, value => {
      if (value && value.length > 0) {
        const { original, text, notes } = value[0];
        textValue.value = text;
        originalValue.value = original;
        notesValue.value = notes;
        // Handle multiple values
        if (value.length > 1) {
          if (
            value.filter(x => x.original === originalValue.value).length !==
            records.value.length
          ) {
            // Not the same values
            // then we need to reset the editable
            originalValue.value = '<MULTIPLE VALUES>';
            textValue.value = '';
            notesValue.value = '';
          }
        }
      }
    });

    return {
      visible,
      notesValue,
      textValue,
      originalValue,
      multiEdit,
      onSave,
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
  }
}
</style>
