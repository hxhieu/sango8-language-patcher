import { SHELL_BLOCK_UI } from '@/store/types';
import { Commit, useStore } from 'vuex';

const unblock = (commit: Commit) => {
  commit(`shell/${SHELL_BLOCK_UI}`, {
    blocked: false,
    text: null,
  });
};

const block = (commit: Commit, text?: string) => {
  commit(`shell/${SHELL_BLOCK_UI}`, {
    blocked: true,
    text,
  });
};

const useBlockUi = () => {
  const { commit } = useStore();
  return {
    block: (text?: string) => block(commit, text),
    unblock: () => unblock(commit),
  };
};

export { useBlockUi };
