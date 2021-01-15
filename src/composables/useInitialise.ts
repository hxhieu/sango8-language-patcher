import {
  EVENT_CHECK_SOURCES,
  EVENT_DOWNLOAD_PROGRESS,
  EVENT_FETCH_PACKS,
  EVENT_UNZIP_PROGRESS,
} from '@/api/const';
import { IpcRendererEvent } from 'electron/main';
import prettyBytes from 'pretty-bytes';
import { useBlockUi } from '@/composables';

const checkAndFetchSources = () => {
  const { block, unblock } = useBlockUi();
  const { ipcRenderer } = window._api;

  // Block the UI
  block('Initialising');

  ipcRenderer.on(EVENT_CHECK_SOURCES, (_: IpcRendererEvent, args: any[]) => {
    // Not found
    if (!args[0]) {
      // Download progress
      ipcRenderer.on(
        EVENT_DOWNLOAD_PROGRESS,
        (_: IpcRendererEvent, args: any[]) => {
          const current = parseInt(args[0], 10) || 0;
          const total = parseInt(args[1], 10) || 0;
          block(`Downloading ${prettyBytes(current)} / ${prettyBytes(total)}`);
        },
      );

      // Unzip progress
      ipcRenderer.on(
        EVENT_UNZIP_PROGRESS,
        (_: IpcRendererEvent, args: any[]) => {
          const current = parseInt(args[0], 10) || 0;
          const total = parseInt(args[1], 10) || 0;
          block(`Unzipping ${current} / ${total} files`);
        },
      );

      // Download done
      ipcRenderer.on(EVENT_FETCH_PACKS, () => {
        unblock();
      });

      // Start the fetching default packs
      ipcRenderer.invoke(EVENT_FETCH_PACKS, ['zh-tw']);
    } else {
      unblock();
    }
  });

  // Check if the source files are there
  ipcRenderer.invoke(EVENT_CHECK_SOURCES);
};

const useInitialise = () => ({
  checkAndFetchSources,
});

export { useInitialise };
