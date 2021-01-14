import { createStore } from 'vuex';
import shell, { ShellStore } from './modules/shell';
import translations, { TranslationStore } from './modules/translations';

export interface RootStore {
  shell: ShellStore;
  translations: TranslationStore;
}

export default createStore({
  modules: {
    shell,
    translations,
  },
  // TODO: Not working
  devtools: process.env.NODE_ENV !== 'production',
});
