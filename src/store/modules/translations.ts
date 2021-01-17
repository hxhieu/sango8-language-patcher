import {
  EVENT_FETCH_LOCAL_RECORDS,
  EVENT_FETCH_SOURCE_RECORDS,
  EVENT_SAVE_RECORDS,
} from '@/api/const';
import { FetchRecordArgs, TranslationRecord } from '@/interfaces';
import { IpcRendererEvent } from 'electron';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { RootStore } from '../';
import {
  TRANSLATIONS_SET_FILTERED_RECORDS,
  TRANSLATIONS_SET_RECORDS_COUNT,
  TRANSLATIONS_SET_SOURCE_RECORDS,
} from '../types';

export interface TranslationStore {
  records: TranslationRecord[];
  sources: TranslationRecord[];
  total: number;
}

const state: TranslationStore = {
  records: [],
  sources: [],
  total: 0,
};

const mutations: MutationTree<TranslationStore> = {
  [TRANSLATIONS_SET_FILTERED_RECORDS]: (
    state,
    records: TranslationRecord[],
  ) => {
    state.records = [...records];
  },
  [TRANSLATIONS_SET_SOURCE_RECORDS]: (state, records: TranslationRecord[]) => {
    state.sources = [...records];
  },
  [TRANSLATIONS_SET_RECORDS_COUNT]: (state, total: number) => {
    state.total = total;
  },
};

const actions: ActionTree<TranslationStore, RootStore> = {
  fetchRecords: (
    { commit },
    { args, fetchSource }: { args: FetchRecordArgs; fetchSource: boolean },
  ) => {
    const { ipcRenderer } = window._api;
    // Update local records
    ipcRenderer.once(
      EVENT_FETCH_LOCAL_RECORDS,
      (_: IpcRendererEvent, args: any[]) => {
        const records = args[0] as TranslationRecord[];
        commit(TRANSLATIONS_SET_FILTERED_RECORDS, records);
      },
    );
    // Update source records
    ipcRenderer.once(
      EVENT_FETCH_SOURCE_RECORDS,
      (_: IpcRendererEvent, args: any[]) => {
        const records = args[0] as TranslationRecord[];
        const total = args[1] as number;
        commit(TRANSLATIONS_SET_SOURCE_RECORDS, records);
        commit(TRANSLATIONS_SET_RECORDS_COUNT, total);
      },
    );

    const {
      fileType,
      search,
      pageIndex,
      pageSize,
      exact,
      local,
      source,
    } = args;

    const channel = fetchSource
      ? EVENT_FETCH_SOURCE_RECORDS
      : EVENT_FETCH_LOCAL_RECORDS;

    const locale = fetchSource ? source : local;

    ipcRenderer.invoke(channel, [
      locale,
      fileType,
      search,
      // Backend is zero based while frontend is 1 based
      pageIndex - 1,
      pageSize,
      exact,
    ]);
  },

  saveRecords: (
    { dispatch },
    {
      ids,
      detail,
      args,
    }: {
      ids: number[];
      detail: TranslationRecord;
      args: FetchRecordArgs;
    },
  ) => {
    const { ipcRenderer } = window._api;
    ipcRenderer.once(EVENT_SAVE_RECORDS, () => {
      // Refetch from the backend
      dispatch('translations/fetchRecords', {
        args,
      });
    });
    ipcRenderer.invoke(EVENT_SAVE_RECORDS, [ids, detail]);
  },
};

const getters: GetterTree<TranslationStore, RootStore> = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
