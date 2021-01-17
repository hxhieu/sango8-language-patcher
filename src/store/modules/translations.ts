import { EVENT_FETCH_RECORDS, EVENT_SAVE_RECORDS } from '@/api/const';
import { FetchRecordArgs, TranslationRecord } from '@/interfaces';
import { IpcRendererEvent } from 'electron';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { RootStore } from '../';
import {
  TRANSLATIONS_SET_FILTERED_RECORDS,
  TRANSLATIONS_SET_RECORDS_COUNT,
} from '../types';

export interface TranslationStore {
  records: TranslationRecord[];
  total: number;
}

const state: TranslationStore = {
  records: [],
  total: 0,
};

const mutations: MutationTree<TranslationStore> = {
  [TRANSLATIONS_SET_FILTERED_RECORDS]: (
    state,
    records: TranslationRecord[],
  ) => {
    state.records = [...records];
  },
  [TRANSLATIONS_SET_RECORDS_COUNT]: (state, total: number) => {
    state.total = total;
  },
};

const actions: ActionTree<TranslationStore, RootStore> = {
  fetchRecords: ({ commit }, args: FetchRecordArgs) => {
    const { ipcRenderer } = window._api;
    args = {
      ...args,
      // Zero based on the backend
      pageIndex: args.pageIndex - 1,
    };

    // Update the state
    ipcRenderer.once(
      EVENT_FETCH_RECORDS,
      (_: IpcRendererEvent, records: TranslationRecord[], total: number) => {
        commit(TRANSLATIONS_SET_FILTERED_RECORDS, records);
        commit(TRANSLATIONS_SET_RECORDS_COUNT, total);
      },
    );

    ipcRenderer.invoke(EVENT_FETCH_RECORDS, args);
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
