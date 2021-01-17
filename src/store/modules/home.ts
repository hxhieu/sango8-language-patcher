import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { HOME_LOCAL_PACKS, HOME_SOURCE_PACKS } from '../types';
import { RootStore } from '../';
import { EVENT_LIST_LOCAL_PACKS } from '@/api/const';
import { IpcRendererEvent } from 'electron';

export interface HomeStore {
  localPacks: string[];
  sourcePacks: string[];
  fileTypes: string[];
  filterPageSizes: number[];
}

const state: HomeStore = {
  localPacks: [],
  sourcePacks: [],
  // TODO: From backend
  fileTypes: ['full', 'part'],
  filterPageSizes: [50, 100, 200, 500],
};

const mutations: MutationTree<HomeStore> = {
  [HOME_SOURCE_PACKS]: (state, packs: string[]) => {
    state.sourcePacks = packs;
  },
  [HOME_LOCAL_PACKS]: (state, packs: string[]) => {
    state.localPacks = packs;
  },
};

const actions: ActionTree<HomeStore, RootStore> = {
  fetchLocalPacks: ({ commit }) => {
    const { ipcRenderer } = window._api;
    ipcRenderer.on(
      EVENT_LIST_LOCAL_PACKS,
      (_: IpcRendererEvent, args: any[]) => {
        const packs = args[0] as string[];
        commit(HOME_LOCAL_PACKS, packs);
      },
    );
    ipcRenderer.invoke(EVENT_LIST_LOCAL_PACKS);
  },
};

const getters: GetterTree<HomeStore, RootStore> = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
