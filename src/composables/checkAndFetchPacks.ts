import {
  EVENT_CHECK_SOURCES,
  EVENT_DOWNLOAD_PROGRESS,
  EVENT_FETCH_PACKS,
  EVENT_UNZIP_PROGRESS,
} from '@/api/const';
import { IpcRendererEvent } from 'electron/main';
import prettyBytes from 'pretty-bytes';
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
        text: 'Getting the initial data',
      });

      // Download progress
      ipcRenderer.on(
        EVENT_DOWNLOAD_PROGRESS,
        (_: IpcRendererEvent, args: any[]) => {
          const current = parseInt(args[0], 10) || 0;
          const total = parseInt(args[1], 10) || 0;
          commit(`shell/${SHELL_BLOCK_UI}`, {
            blocked: true,
            text: `Downloading ${prettyBytes(current)} / ${prettyBytes(total)}`,
          });
        },
      );

      // Unzip progress
      ipcRenderer.on(
        EVENT_UNZIP_PROGRESS,
        (_: IpcRendererEvent, args: any[]) => {
          const current = parseInt(args[0], 10) || 0;
          const total = parseInt(args[1], 10) || 0;
          commit(`shell/${SHELL_BLOCK_UI}`, {
            blocked: true,
            text: `Unzipping ${current} / ${total} files`,
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

      // Start the fetching default packs
      ipcRenderer.invoke(EVENT_FETCH_PACKS);
    }
  });

  // Check if the source files are there
  ipcRenderer.invoke(EVENT_CHECK_SOURCES);
};

export { checkAndFetchPacks };
