import { SourceVariant } from '@/interfaces';
import { app, BrowserWindow, dialog, Menu } from 'electron';
import { basename } from 'path';
import { readArchive } from '../archiveUtils';
import { EVENT_BLOCK_UI, EVENT_UNBLOCK_UI } from '../const';
import { parseSources, readSource } from '../debug/parseSources';
import { readFileAsync } from '../nodeApi';
import { normaliseTranslations } from '../nomaliseTranslation';
import { writeTranslation } from '../writeTranslation';

const blockUi = (message: string) => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.webContents.send(EVENT_BLOCK_UI, message);
  }
};

const unblockUi = () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    console.log('aaa');
    win.webContents.send(EVENT_UNBLOCK_UI);
  }
};

const sourceArchive = async (variant: SourceVariant) => {
  blockUi('Archiving the source files');
  await parseSources(variant);
  unblockUi();
};

const extractPatch = async () => {
  const file = await dialog.showOpenDialog({
    properties: ['openFile'],
  });
  if (file && file.filePaths && file.filePaths[0]) {
    blockUi('Extracting patch file');
    const filePath = file.filePaths[0];
    const content = await readFileAsync(filePath, 'utf8');
    const records = normaliseTranslations(readSource(content));

    const segs = basename(filePath).split('.');
    const variant = segs[1];
    const fileType = segs[0].split('_')[1].toLowerCase();
    const sourceArchive = await readArchive(variant);
    if (sourceArchive && sourceArchive[fileType]) {
      const sources = sourceArchive[fileType];
      for (var source of sources) {
        source.text = records[source.id];
      }
      await writeTranslation(
        `${variant}.extracted`,
        sources,
        fileType !== 'full',
        true,
      );
    }
    unblockUi();
  }
};

const setPatchLocation = async () => {
  const file = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  if (file && file.filePaths && file.filePaths[0]) {
    console.log(file.filePaths[0]);
  }
};

const reloadWindow = () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.reload();
  }
};

const menu = Menu.buildFromTemplate([
  {
    label: 'Application',
    submenu: [
      {
        label: 'Reload window',
        click: reloadWindow,
      },
      {
        label: 'Exit',
        click: () => app.exit(),
      },
    ],
  },
  {
    label: 'Source files',
    submenu: [
      {
        label: 'Extract and archive',
        submenu: [
          {
            label: 'zh-tw',
            click: () => sourceArchive('zh-tw'),
          },
          {
            label: 'zh-cn',
            click: () => sourceArchive('zh-cn'),
          },
        ],
      },
    ],
  },
  {
    label: 'Patches',
    submenu: [
      {
        label: 'Set patch location',
        click: setPatchLocation,
      },
      {
        label: 'Extract patched file',
        click: extractPatch,
      },
    ],
  },
]);

export default menu;
