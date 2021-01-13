import { remote } from 'electron';

const { exit } = remote.app;

// To comfort ElectronApi interface
window._api = {
  exit,
};
