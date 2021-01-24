import { setPatchDir } from '@/api/createPatches';
import { dialog } from 'electron';

const setPatchLocation = async () => {
  const file = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  if (file && file.filePaths && file.filePaths[0]) {
    setPatchDir(file.filePaths[0]);
  }
};

export { setPatchLocation };
