import {
  EVENT_CHECK_SOURCES,
  EVENT_DOWNLOAD_PROGRESS,
  EVENT_FETCH_PACKS,
} from '@/api/const';
import { IpcRendererEvent } from 'electron/main';
import { useStore } from 'vuex';
import { RootStore } from '@/store';
import { SHELL_BLOCK_UI } from '@/store/types';

const checkAndFetchPacks = () => {
  const { commit } = useStore<RootStore>();
  const { ipcRenderer } = window._api;

  ipcRenderer.on(EVENT_CHECK_SOURCES, (_: IpcRendererEvent, args: any[]) => {
    // Not found
    if (!args[0]) {
      // Block the UI
      commit(`shell/${SHELL_BLOCK_UI}`, {
        blocked: true,
        text: 'Fetching the initial data',
      });

      // Download progress
      ipcRenderer.on(
        EVENT_DOWNLOAD_PROGRESS,
        (_: IpcRendererEvent, args: any[]) => {
          commit(`shell/${SHELL_BLOCK_UI}`, {
            blocked: true,
            text: `Downloading ${args[0]} / ${args[1]}`,
          });
        },
      );

      // Download done
      ipcRenderer.on(EVENT_FETCH_PACKS, () => {
        commit(`shell/${SHELL_BLOCK_UI}`, {
          blocked: false,
          text: null,
        });
      });

      // Then fetch the source file
      ipcRenderer.invoke(EVENT_FETCH_PACKS);
    }
  });

  // Check if the source files are there
  ipcRenderer.invoke(EVENT_CHECK_SOURCES);
};

export { checkAndFetchPacks };
