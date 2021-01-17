<template>
  <div class="home">
    <PackList
      :locals="localPacks"
      :sources="sourcePacks"
      :files="fileTypes"
      v-model:value="packListModel"
    />
    <RecordFilter
      v-if="packListModel.local"
      :pageSizes="filterPageSizes"
      v-model:value="filterModel"
    />
    <ul>
      <li v-for="record in records" :key="record.id">
        [{{ record.id }}] {{ record.text }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useHome, useInitialise, useTranslations } from '@/composables';
import { RootStore } from '@/store';
import PackList from '@/components/PackList.vue';
import RecordFilter from '@/components/RecordFilter.vue';
import {
  FetchRecordArgs,
  PackListModel,
  RecordFilterModel,
} from '@/interfaces';

export default defineComponent({
  name: 'Home',
  components: {
    PackList,
    RecordFilter,
  },
  setup() {
    const { checkAndFetchSources } = useInitialise();
    const { fetchRecords } = useTranslations();
    const { fetchLocalPacks } = useHome();
    const { state } = useStore<RootStore>();

    const records = computed(() => state.translations.records);
    const localPacks = computed(() => state.home.localPacks);
    const sourcePacks = computed(() => state.home.sourcePacks);
    const fileTypes = computed(() => state.home.fileTypes);

    const filterPageSizes = computed(() => state.home.filterPageSizes);

    const packListModel = ref<PackListModel>({
      source: 'zh-tw',
    });

    const filterModel = ref<RecordFilterModel>({
      pageIndex: 1,
      pageSize: 100,
      exact: false,
    });

    checkAndFetchSources();
    fetchLocalPacks();

    watch(
      [packListModel, filterModel],
      ([list, filter]) => {
        const args = {
          ...list,
          ...filter,
        } as FetchRecordArgs;
        // Refetch local records
        fetchRecords(args, args.local);

        // Refetch source records
        fetchRecords(args, args.source);
      },
      { deep: true },
    );

    return {
      records,
      localPacks,
      sourcePacks,
      fileTypes,
      packListModel,
      filterPageSizes,
      filterModel,
    };
  },
});
</script>

<style lang="scss">
.record-filters {
  .p-panel-header {
    border-top: 0 !important;
  }
}
</style>
