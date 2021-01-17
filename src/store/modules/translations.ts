import { EVENT_FETCH_RECORDS } from '@/api/const';
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
  fetchRecords: (
    { commit },
    { locale, args }: { locale: string; args: FetchRecordArgs },
  ) => {
    const { ipcRenderer } = window._api;
    ipcRenderer.on(EVENT_FETCH_RECORDS, (_: IpcRendererEvent, args: any[]) => {
      const records = args[0] as TranslationRecord[];
      commit(TRANSLATIONS_SET_FILTERED_RECORDS, records);
      const total = args[1] as number;
      commit(TRANSLATIONS_SET_RECORDS_COUNT, total);
    });
    const { fileType, search, pageIndex, pageSize, exact } = args;
    ipcRenderer.invoke(EVENT_FETCH_RECORDS, [
      locale,
      fileType,
      search,
      // Backend is zero based while frontend is 1 based
      pageIndex - 1,
      pageSize,
      exact,
    ]);
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
