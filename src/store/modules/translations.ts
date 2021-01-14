import { TranslationRecord } from '@/interfaces/translationRecord';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { RootStore } from '../';

export interface TranslationStore {
  records: TranslationRecord[];
}

const state: TranslationStore = {
  records: [],
};

const mutations: MutationTree<TranslationStore> = {};

const actions: ActionTree<TranslationStore, RootStore> = {};

const getters: GetterTree<TranslationStore, RootStore> = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
