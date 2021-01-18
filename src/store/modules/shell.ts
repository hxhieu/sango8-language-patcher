import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { SHELL_BLOCK_UI, SHELL_SET_THEME } from '../types';
import { RootStore } from '../';

export type Theme = 'dark' | 'light';

export interface ShellStore {
  blockUI: boolean;
  blockText?: string;
  theme: Theme;
  debug: boolean;
}

const state: ShellStore = {
  blockUI: false,
  theme: 'dark',
  debug: process.env.NODE_ENV !== 'production',
};

const mutations: MutationTree<ShellStore> = {
  [SHELL_BLOCK_UI]: (
    state,
    { blocked, text }: { blocked?: boolean; text?: string },
  ) => {
    state.blockUI = blocked || false;
    state.blockText = text;
  },
  [SHELL_SET_THEME]: (state, theme: Theme) => {
    state.theme = theme;
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
