import { Theme } from '@/store/modules/shell';
import { SHELL_SET_THEME } from '@/store/types';
import { Commit, useStore } from 'vuex';

const setTheme = (commit: Commit, theme: Theme) => {
  commit(`shell/${SHELL_SET_THEME}`, theme);
};

const useShell = () => {
  const { commit } = useStore();
  return {
    setTheme: (theme: Theme) => setTheme(commit, theme),
  };
};

export { useShell };
