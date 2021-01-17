import {
  EVENT_CHECK_SOURCES,
  EVENT_DOWNLOAD_PROGRESS,
  EVENT_FETCH_PACKS,
} from '@/api/const';
import { IpcRendererEvent } from 'electron/main';
import { useStore } from 'vuex';
import prettyBytes from 'pretty-bytes';
import { useBlockUi } from '@/composables';
import { HOME_SOURCE_PACKS } from '@/store/types';

const checkAndFetchSources = () => {
  const { block, unblock } = useBlockUi();
  const { commit } = useStore();
  const { ipcRenderer } = window._api;
  const firstSourcePack = 'zh-tw';

  const done = () => {
    unblock();
    commit(`home/${HOME_SOURCE_PACKS}`, [firstSourcePack]);
  };

  // Block the UI
  block('Initialising');

  ipcRenderer.once(
    EVENT_CHECK_SOURCES,
    (_: IpcRendererEvent, valid: boolean) => {
      // Not found
      if (!valid) {
        // Download progress
        ipcRenderer.on(
          EVENT_DOWNLOAD_PROGRESS,
          (_: IpcRendererEvent, current: number, total: number) => {
            block(
              `Downloading ${prettyBytes(current)} / ${prettyBytes(total)}`,
            );
          },
        );

        // Download done
        ipcRenderer.once(EVENT_FETCH_PACKS, () => {
          done();
        });

        // Start the fetching default packs
        ipcRenderer.invoke(EVENT_FETCH_PACKS, firstSourcePack);
      } else {
        done();
      }
    },
  );

  // Check if the source files are there
  ipcRenderer.invoke(EVENT_CHECK_SOURCES);
};

const useInitialise = () => ({
  checkAndFetchSources,
});

export { useInitialise };
