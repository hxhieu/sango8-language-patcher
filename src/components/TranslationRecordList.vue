<template>
  <div class="translation-records-list">
    <DataTable
      class="p-datatable-sm p-datatable-gridlines"
      :value="model"
      :scrollable="true"
      scrollHeight="flex"
      dataKey="id"
      v-model:selection="selection"
    >
      <template #header>
        <div class="table-header">
          Showing {{ model.length }} of total {{ total }} records
        </div>
      </template>
      <Column selectionMode="multiple" headerStyle="width: 38px"></Column>
      <Column field="id" header="ID" headerStyle="width: 80px"></Column>
      <Column field="original" header="Original"></Column>
      <Column field="text" header="Translation"></Column>
      <Column headerStyle="width: 80px">
        <template #header>
          <div class="bulk-menu-container">
            <Button
              icon="pi pi-cog"
              aria-haspopup="true"
              aria-controls="bulk-menu"
              @click="toggleBulkMenu"
            />
            <Menu
              id="bulk-menu"
              ref="bulkMenu"
              :model="bulkMenuItems"
              :popup="true"
            />
          </div>
        </template>
        <template #body="slotProps">
          <Button
            class="p-button-outlined p-button-sm"
            @click="editRecords([slotProps.data])"
            >Edit</Button
          >
        </template>
      </Column>
      <template #empty>
        <div class="no-records">
          <Message severity="warn">No records found</Message>
        </div>
      </template>
    </DataTable>
  </div>
  <EditRecords
    :records="editFormRecords"
    :show="showEditForm"
    @hide="showEditForm = false"
    @save="saveRecords"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Menu from 'primevue/menu';

import { TranslationRecord } from '@/interfaces';

import EditRecords from './EditRecords.vue';

export default defineComponent({
  name: 'RecordList',
  components: {
    DataTable,
    Column,
    Menu,
    EditRecords,
  },
  props: {
    records: {
      type: Array,
    },
    totalRecords: {
      type: Number,
    },
  },
  emits: ['save', 'translate', 'revert'],
  setup(props, { emit }) {
    const model = computed<TranslationRecord>(
      () => (props.records as unknown) as TranslationRecord,
    );

    const bulkMenu = ref();

    const total = computed(() => props.totalRecords);

    const selection = ref<TranslationRecord[]>([]);
    const editFormRecords = ref<TranslationRecord[]>([]);
    const showEditForm = ref(false);

    const editRecords = (records: TranslationRecord[]) => {
      editFormRecords.value = records;
      showEditForm.value = true;
    };

    const saveRecords = (detail: TranslationRecord) => {
      const { text, notes } = detail;
      emit(
        'save',
        editFormRecords.value.map(x => ({
          ...x,
          text,
          notes,
        })),
      );
      editFormRecords.value = [];
    };

    const translateRecords = (provider: string) => {
      emit('translate', {
        provider,
        records: selection.value.map(x => ({ ...x })),
      });
    };

    const revertRecords = () => {
      emit('revert', {
        records: selection.value.map(x => ({ ...x })),
      });
    };

    const multiEdit = computed(
      () => selection.value && selection.value.length > 0,
    );

    const bulkMenuItems = computed(() => {
      const items = [];
      const googleTranslate = {
        label: 'Google Translate',
        items: [
          {
            label: 'All',
            icon: 'pi pi-cog',
            command: () => translateRecords('google'),
          },
        ],
      };

      items.push(googleTranslate);

      const revert = {
        label: 'Revert to source',
        items: [
          {
            label: 'All',
            icon: 'pi pi-times',
            command: () => revertRecords(),
          },
        ],
      };

      items.push(revert);

      if (multiEdit.value) {
        googleTranslate.items[0].label = 'Selected';
        revert.items[0].label = 'Selected';
        items.push({
          label: 'Manual',
          items: [
            {
              label: 'Edit selected',
              icon: 'pi pi-pencil',
              command: () => {
                editRecords(selection.value);
              },
            },
          ],
        });
      }

      return items;
    });

    const toggleBulkMenu = (evt: any) => {
      bulkMenu.value.toggle(evt);
    };

    watch(model, () => {
      selection.value = [];
    });

    return {
      model,
      selection,
      total,
      bulkMenu,
      bulkMenuItems,
      toggleBulkMenu,
      editRecords,
      editFormRecords,
      showEditForm,
      saveRecords,
      multiEdit,
    };
  },
});
</script>

<style lang="scss" scoped>
.no-records {
  display: flex;
  justify-content: center;
}

.table-header {
  padding: 0 20px;
}

#bulk-menu {
  top: 42px !important;
}
</style>
