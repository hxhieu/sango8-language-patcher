<template>
  <div class="home">
    <PackList
      :locals="localPacks"
      :sources="sourcePacks"
      :files="fileTypes"
      v-model:value="packListModel"
      @newPack="showNewPackForm = true"
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
      @revert="revert"
      @writeAll="writeAll"
    />
    <NewPackForm
      :show="showNewPackForm"
      @hide="showNewPackForm = false"
      :languages="supportLanguages"
      @save="newPack"
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
import NewPackForm from '@/components/NewPackForm.vue';

import {
  FetchRecordArgs,
  PackListModel,
  RecordFilterModel,
  TranslationRecord,
} from '@/interfaces';
import {
  EVENT_FETCH_RECORDS,
  EVENT_NEW_PACK,
  EVENT_TRANSLATE_RECORDS_BATCH,
} from '@/api/const';
import { IpcRendererEvent } from 'electron';

export default defineComponent({
  name: 'Home',
  components: {
    PackList,
    RecordFilter,
    TranslationRecordList,
    NewPackForm,
  },
  setup() {
    const { ipcRenderer } = window._api;
    const { checkAndFetchSources } = useInitialise();
    const {
      fetchRecords,
      saveRecords,
      translateRecords,
      revertRecords,
    } = useTranslations();
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

    const showNewPackForm = ref(false);
    const supportLanguages = computed(() => home.supportLanguages);

    const save = (records: TranslationRecord[]) => {
      if (
        records.length > 1 &&
        !confirm(
          'Your are updating multiple records with the same translation.\nAre you sure you want to do it?',
        )
      ) {
        return;
      }
      block(`Saving the record${records.length > 1 ? 's' : ''}`);
      saveRecords(fetchArgs.value, records);
    };

    const writeAll = () => {
      block(`Writing the records`);
      saveRecords(fetchArgs.value);
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
      translateRecords(provider, records, fetchArgs.value);
    };

    const revert = ({ records }: { records: TranslationRecord[] }) => {
      if (
        records.length === 0 &&
        !confirm(
          'You are about to revert ALL records\nAre you sure you want to do it?',
        )
      ) {
        return;
      }
      block('Reverting the records');
      revertRecords(records, fetchArgs.value);
    };

    const newPack = ({
      name,
      language,
    }: {
      name: string;
      language: string;
    }) => {
      ipcRenderer.invoke(EVENT_NEW_PACK, `${language}.${name}`);
    };

    checkAndFetchSources();
    fetchLocalPacks();

    ipcRenderer.on(
      EVENT_TRANSLATE_RECORDS_BATCH,
      (_: IpcRendererEvent, current: number, total: number) => {
        block(`Translating batch ${current} of ${total}`);
      },
    );

    ipcRenderer.on(EVENT_FETCH_RECORDS, () => {
      unblock();
    });

    ipcRenderer.on(EVENT_NEW_PACK, (_: IpcRendererEvent, packName: string) => {
      fetchLocalPacks();
      packListModel.value.local = packName;
      packListModel.value.fileType = packListModel.value.fileType || 'full';
    });

    // Refetch the records when filters changed
    watch(
      fetchArgs,
      value => {
        block('Fetching records');
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
      revert,
      writeAll,
      showNewPackForm,
      supportLanguages,
      newPack,
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
  padding-bottom: 96px;
}
</style>
