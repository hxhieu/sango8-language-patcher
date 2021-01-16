import { createStore } from 'vuex';
import shell, { ShellStore } from './modules/shell';
import translations, { TranslationStore } from './modules/translations';
import home, { HomeStore } from './modules/home';

export interface RootStore {
  shell: ShellStore;
  translations: TranslationStore;
  home: HomeStore;
}

export default createStore({
  modules: {
    shell,
    translations,
    home,
  },
  // TODO: Not working
  devtools: process.env.NODE_ENV !== 'production',
});
