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
          <div
            v-if="selection && selection.length > 0"
            class="bulk-menu-container"
          >
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
    :records="recordsToEdit"
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
  emits: ['save'],
  setup(props, { emit }) {
    const model = computed<TranslationRecord>(
      () => (props.records as unknown) as TranslationRecord,
    );

    const total = computed(() => props.totalRecords);

    const selection = ref<TranslationRecord[]>([]);
    const bulkMenu = ref();
    const recordsToEdit = ref<TranslationRecord[]>([]);
    const showEditForm = ref(false);

    const editRecords = (records: TranslationRecord[]) => {
      selection.value = [];
      recordsToEdit.value = records;
      showEditForm.value = true;
    };

    const saveRecords = (detail: TranslationRecord) => {
      const { text, notes } = detail;
      emit(
        'save',
        recordsToEdit.value.map(x => ({
          ...x,
          text,
          notes,
        })),
      );
      recordsToEdit.value = [];
    };

    const bulkMenuItems = ref([
      {
        label: 'Edit selected',
        icon: 'pi pi-pencil',
        command: () => {
          editRecords(selection.value);
        },
      },
    ]);

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
      recordsToEdit,
      showEditForm,
      saveRecords,
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
