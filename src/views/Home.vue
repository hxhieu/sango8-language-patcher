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
      :totalRecords="totalRecords"
      v-model:value="filterModel"
    />
    <TranslationRecordList
      v-if="packListModel.local"
      :records="records"
      :totalRecords="totalRecords"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useHome, useInitialise, useTranslations } from '@/composables';
import { RootStore } from '@/store';

import PackList from '@/components/PackList.vue';
import RecordFilter from '@/components/RecordFilter.vue';
import TranslationRecordList from '@/components/TranslationRecordList.vue';

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
    TranslationRecordList,
  },
  setup() {
    const { checkAndFetchSources } = useInitialise();
    const { fetchRecords } = useTranslations();
    const { fetchLocalPacks } = useHome();
    const { state } = useStore<RootStore>();

    const packListModel = ref<PackListModel>({
      source: 'zh-tw',
    });

    const filterModel = ref<RecordFilterModel>({
      pageIndex: 1,
      pageSize: 100,
      exact: false,
    });

    const records = computed(() => state.translations.records);
    const localPacks = computed(() => state.home.localPacks);
    const sourcePacks = computed(() => state.home.sourcePacks);
    const fileTypes = computed(() => state.home.fileTypes);

    const filterPageSizes = computed(() => state.home.filterPageSizes);
    const totalRecords = computed(() => state.translations.total);

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
      totalRecords,
    };
  },
});
</script>

<style lang="scss">
.home {
  display: flex;
  flex-direction: column;
}
.record-filters {
  .p-panel-header {
    border-top: 0 !important;
  }
  .p-panel-content {
    border-bottom: 0 !important;
  }
}
.translation-records-list {
  flex: 1;
  overflow: hidden;
  padding-bottom: 76px;
}
</style>
