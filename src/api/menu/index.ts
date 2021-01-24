import { app, BrowserWindow, Menu } from 'electron';
import { MenuItemConstructorOptions } from 'electron/main';
import { buildCreatePatchSubmenu } from './buildCreatePatchSubMenu';
import { extractPatch } from './extractPatch';
import { setPatchLocation } from './setPatchLocation';
import { sourceArchive } from './sourceArchive';

const reloadWindow = () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.reload();
  }
};

const buildMenu = async () => {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'Application',
      submenu: [
        {
          label: 'Reload window',
          click: reloadWindow,
        },
        {
          type: 'separator',
        },
        {
          label: 'Exit',
          click: () => app.exit(),
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
          label: 'Create patches',
          submenu: [
            {
              label: 'To zh-tw',
              submenu: await buildCreatePatchSubmenu('zh-tw'),
            },
            {
              label: 'To zh-cn',
              submenu: await buildCreatePatchSubmenu('zh-cn'),
            },
          ],
        },
        {
          type: 'separator',
        },
        {
          label: 'Extract patched file',
          click: extractPatch,
        },
      ],
    },
  ];

  if (process.env.NODE_ENV !== 'production') {
    template.push({
      label: 'Debug',
      submenu: [
        {
          label: 'Archive source files',
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
    });
  }

  return Menu.buildFromTemplate(template);
};

export default buildMenu;
