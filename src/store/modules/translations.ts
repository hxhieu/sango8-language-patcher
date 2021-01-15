import { EVENT_FETCH_RECORDS } from '@/api/const';
import { TranslationRecord } from '@/interfaces';
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
    { locale, source }: { locale: string; source: string },
  ) => {
    const { ipcRenderer } = window._api;
    ipcRenderer.on(EVENT_FETCH_RECORDS, (_: IpcRendererEvent, args: any[]) => {
      const records = args[0] as TranslationRecord[];
      commit(TRANSLATIONS_SET_ALL_RECORDS, records);
    });
    ipcRenderer.invoke(EVENT_FETCH_RECORDS, [locale, source]);
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
