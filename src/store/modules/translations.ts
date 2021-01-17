import { EVENT_FETCH_RECORDS } from '@/api/const';
import { FetchRecordArgs, TranslationRecord } from '@/interfaces';
import { IpcRendererEvent } from 'electron';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { RootStore } from '../';
import { TRANSLATIONS_SET_ALL_RECORDS } from '../types';

export interface TranslationStore {
  records: TranslationRecord[];
}

const state: TranslationStore = {
  records: [],
};

const mutations: MutationTree<TranslationStore> = {
  [TRANSLATIONS_SET_ALL_RECORDS]: (state, records: TranslationRecord[]) => {
    state.records = [...records];
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
      commit(TRANSLATIONS_SET_ALL_RECORDS, records);
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
