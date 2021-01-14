import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { SHELL_BLOCK_UI } from '../types';
import { RootStore } from '../';

export interface ShellStore {
  blockUI: boolean;
  blockText?: string;
}

const state: ShellStore = {
  blockUI: false,
};

const mutations: MutationTree<ShellStore> = {
  [SHELL_BLOCK_UI]: (
    state,
    { blocked, text }: { blocked?: boolean; text?: string },
  ) => {
    state.blockUI = blocked || false;
    state.blockText = text;
  },
};

const actions: ActionTree<ShellStore, RootStore> = {};

const getters: GetterTree<ShellStore, RootStore> = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
