import { createStore } from 'vuex';
import shell, { ShellStore } from './modules/Shell';

export interface RootStore {
  shell: ShellStore;
}

export default createStore({
  modules: {
    shell,
  },
  devtools: process.env.NODE_ENV !== 'production',
});
