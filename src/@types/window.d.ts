import { Remote } from 'electron';

declare global {
  // We should only expose a subset of Node API that we need here
  interface ElectronApi {
    exit: (code?: number) => void;
  }

  interface Window {
    _api: ElectronApi;
  }
}
