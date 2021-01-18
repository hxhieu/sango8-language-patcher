<template>
  <div class="home">
    <DebugPanel v-if="debug" />
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
      @save="save"
      @translate="translate"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';
import {
  useBlockUi,
  useHome,
  useInitialise,
  useTranslations,
} from '@/composables';
import { RootStore } from '@/store';

import PackList from '@/components/PackList.vue';
import RecordFilter from '@/components/RecordFilter.vue';
import TranslationRecordList from '@/components/TranslationRecordList.vue';
import DebugPanel from '@/components/DebugPanel.vue';

import {
  FetchRecordArgs,
  PackListModel,
  RecordFilterModel,
  TranslationRecord,
} from '@/interfaces';
import {
  EVENT_TRANSLATE_RECORDS,
  EVENT_TRANSLATE_RECORDS_BATCH,
} from '@/api/const';
import { IpcRendererEvent } from 'electron';

export default defineComponent({
  name: 'Home',
  components: {
    PackList,
    RecordFilter,
    TranslationRecordList,
    DebugPanel,
  },
  setup() {
    const { ipcRenderer } = window._api;
    const { checkAndFetchSources } = useInitialise();
    const { fetchRecords, saveRecords, translateRecords } = useTranslations();
    const { fetchLocalPacks } = useHome();
    const { block, unblock } = useBlockUi();
    const {
      state: { translations, home, shell },
    } = useStore<RootStore>();

    const debug = computed(() => shell.debug);

    const packListModel = ref<PackListModel>({
      source: 'zh-tw',
    });

    const filterModel = ref<RecordFilterModel>({
      pageIndex: 1,
      pageSize: 100,
      exact: false,
    });

    const fetchArgs = computed<FetchRecordArgs>(() => ({
      ...packListModel.value,
      ...filterModel.value,
    }));

    const records = computed(() => translations.records);
    const localPacks = computed(() => home.localPacks);
    const sourcePacks = computed(() => home.sourcePacks);
    const fileTypes = computed(() => home.fileTypes);

    const filterPageSizes = computed(() => home.filterPageSizes);
    const totalRecords = computed(() => translations.total);

    const save = (records: TranslationRecord[]) => {
      if (
        records.length > 1 &&
        !confirm(
          'Your are updating multiple records with the same translation.\nAre you sure you want to do it?',
        )
      ) {
        return;
      }
      saveRecords(records, fetchArgs.value);
    };

    const translate = ({
      provider,
      records,
    }: {
      provider: string;
      records: TranslationRecord[];
    }) => {
      if (
        records.length === 0 &&
        !confirm(
          'You are about to translate ALL records\nAre you sure you want to do it?',
        )
      ) {
        return;
      }
      block('Translating the records');

      ipcRenderer.once(EVENT_TRANSLATE_RECORDS, () => {
        unblock();
      });
      translateRecords(provider, records, fetchArgs.value);
    };

    checkAndFetchSources();
    fetchLocalPacks();

    ipcRenderer.on(
      EVENT_TRANSLATE_RECORDS_BATCH,
      (_: IpcRendererEvent, current: number, total: number) => {
        block(`Translating batch ${current} of ${total}`);
      },
    );

    // Refetch the records when filters changed
    watch(
      fetchArgs,
      value => {
        fetchRecords(value);
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
      save,
      translate,
      debug,
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
