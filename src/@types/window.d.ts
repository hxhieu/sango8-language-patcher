import { IpcRenderer } from 'electron';

declare global {
  // We should only expose a subset of Node API that we need here
  interface ElectronApi {
    workDir: string;
    ipcRenderer: IpcRenderer;
  }

  interface Window {
    _api: ElectronApi;
  }
}
