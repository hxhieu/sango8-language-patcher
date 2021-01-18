<template>
  <Panel header="Filters" :toggleable="true" class="record-filters">
    <div class="form-section main-form">
      <form class="form-section form-control search" @keyup.enter="change">
        <InputText
          class="form-control"
          type="text"
          placeholder="Text to search"
          v-model="searchInternal"
        />
        <label class="form-control">Exact</label>
        <InputSwitch class="form-control" v-model="exactInternal" />
        <Button class="form-control" label="Search" @click="change" autofocus />
      </form>
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
    totalRecords: {
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
    const exactInternal = ref(model.value.exact);

    const sizes = computed(() => props.pageSizes || []);
    const pages = computed(() => {
      const result: number[] = [];
      const pageCount = Math.ceil(
        (props.totalRecords || 1) / model.value.pageSize,
      );
      for (let i = 1; i <= pageCount; i++) {
        result.push(i);
      }
      return result;
    });

    const change = () => {
      model.value.search = searchInternal.value;
      model.value.exact = exactInternal.value;
      emit('update:value', model.value);
    };

    return {
      sizes,
      pages,
      model,
      searchInternal,
      exactInternal,
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
