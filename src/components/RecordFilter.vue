<template>
  <Panel header="Filters" :toggleable="true" class="record-filters">
    <div class="form-section main-form">
      <div class="form-section form-control search">
        <InputText
          class="form-control"
          type="text"
          placeholder="Text to search"
          v-model="searchInternal"
        />
        <label class="form-control">Exact</label>
        <InputSwitch
          class="form-control"
          v-model="model.exact"
          @change="change"
        />
        <Button class="form-control" label="Search" @click="change" />
      </div>
      <div class="form-section form-control page">
        <label class="form-control">Page</label>
        <Dropdown
          class="form-control"
          :options="pages"
          v-model="model.pageIndex"
          @change="change"
        />
        <label class="form-control">of {{ pages.length }}</label>
        <Dropdown
          class="form-control"
          :options="sizes"
          v-model="model.pageSize"
          @change="change"
        />
        <label class="form-control">per page</label>
      </div>
    </div>
  </Panel>
</template>

<script lang="ts">
import { RecordFilterModel } from '@/interfaces';
import { computed, defineComponent, ref } from 'vue';
import InputSwitch from 'primevue/inputswitch';

export default defineComponent({
  name: 'RecordFilter',
  components: {
    InputSwitch,
  },
  props: {
    search: {
      type: String,
    },
    pageIndex: {
      type: Number,
    },
    pageSize: {
      type: Number,
    },
    pageCount: {
      type: Number,
    },
    pageSizes: {
      type: Array,
    },
    value: {
      type: Object,
    },
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const { search, pageSize, pageIndex, exact } = (props.value ||
      {}) as RecordFilterModel;

    const model = ref<RecordFilterModel>({
      search,
      exact,
      pageIndex: pageIndex || 1,
      pageSize: pageSize || 100,
    });

    const searchInternal = ref(model.value.search);

    const sizes = computed(() => props.pageSizes || []);
    const pages = computed(() => {
      const result: number[] = [];
      for (let i = 1; i <= (props.pageCount || 1); i++) {
        result.push(i);
      }
      return result;
    });

    const change = () => {
      model.value.search = searchInternal.value;
      emit('update:value', model.value);
    };

    return {
      sizes,
      pages,
      model,
      searchInternal,
      change,
    };
  },
});
</script>

<style lang="scss" scoped>
.main-form {
  .search {
    flex-grow: 1;
    input {
      flex-grow: 1;
    }
  }
}
</style>
