import { app, Menu, BrowserWindow } from 'electron';
import {
  privacyPolicyWindow,
  termsOfServiceWindow
} from './utils/createWindows';
import { DEBUG_PROD, IS_DEV } from './constants/env';
import { APP_NAME, APP_DISCORD_SERVER } from './constants/meta';
import { openExternalUrl } from './utils/url';

export default class MenuBuilder {
  mainWindow: BrowserWindow | null;

  autoAppUpdate: any;

  appUpdaterEnable: boolean;

  constructor({
    mainWindow,
    autoAppUpdate,
    appUpdaterEnable
  }: {
    mainWindow: any;
    autoAppUpdate: any;
    appUpdaterEnable: boolean;
  }) {
    this.mainWindow = mainWindow;
    this.autoAppUpdate = autoAppUpdate;
    this.appUpdaterEnable = appUpdaterEnable;
  }

  buildMenu() {
    if (IS_DEV || DEBUG_PROD) {
      this.setupDevelopmentEnvironment();
    }

    const template: any =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment() {
    if (this.mainWindow) {
      this.mainWindow.webContents.on('context-menu', (_: any, props: any) => {
        const { x, y } = props;

        if (this.mainWindow) {
          Menu.buildFromTemplate([
            {
              label: 'Inspect element',
              click: () => {
                if (this.mainWindow) {
                  this.mainWindow.webContents.inspectElement(x, y);
                }
              }
            }
          ]).popup({
            x,
            y,
            window: this.mainWindow
          });
        }
      });

      this.mainWindow.webContents.openDevTools();
    }
  }

  buildDarwinTemplate() {
    const subMenuAbout = {
      label: `${APP_NAME}`,
      submenu: [
        {
          label: `About ${APP_NAME}`,
          selector: 'orderFrontStandardAboutPanel:'
        },
        { type: 'separator' },
        {
          visible: this.appUpdaterEnable,
          label: 'Check For Updates',
          click: () => {
            this.autoAppUpdate.forceCheck();
          }
        },
        { type: 'separator' },
        {
          label: `Hide ${APP_NAME}`,
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    };
    const subMenuEdit = {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'Command+Z',
          selector: 'undo:',
          role: 'undo'
        },
        {
          label: 'Redo',
          accelerator: 'Command+Y',
          selector: 'redo:',
          role: 'redo'
        },
        { type: 'separator' },
        {
          label: 'Cut',
          accelerator: 'Command+X',
          selector: 'cut:',
          role: 'cut'
        },
        {
          label: 'Copy',
          accelerator: 'Command+C',
          selector: 'copy:',
          role: 'copy'
        },
        {
          label: 'Paste',
          accelerator: 'Command+V',
          selector: 'paste:',
          role: 'paste'
        },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:',
          role: 'selectAll'
        }
      ]
    };
    const subMenuViewDev = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            if (this.mainWindow) {
              this.mainWindow.webContents.reload();
            }
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            if (this.mainWindow) {
              this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
            }
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            if (this.mainWindow) {
              this.mainWindow.webContents.toggleDevTools();
            }
          }
        }
      ]
    };
    const subMenuViewProd = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            if (this.mainWindow) {
              this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
            }
          }
        }
      ]
    };
    const subMenuWindow = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All To Front', selector: 'arrangeInFront:' }
      ]
    };
    const subMenuHelp = {
      label: 'Support',
      submenu: [
        {
          label: 'Privacy Policy',
          click: () => {
            privacyPolicyWindow();
          }
        },
        {
          label: 'Terms of Service',
          click: () => {
            termsOfServiceWindow();
          }
        },
        {
          label: 'Discord Server',
          click: () => {
            openExternalUrl(APP_DISCORD_SERVER);
          }
        }
      ]
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ? subMenuViewDev : subMenuViewProd;

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
  }

  buildDefaultTemplate() {
    return [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O'
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              if (this.mainWindow) {
                this.mainWindow.close();
              }
            }
          }
        ]
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    if (this.mainWindow) {
                      this.mainWindow.webContents.reload();
                    }
                  }
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    if (this.mainWindow) {
                      this.mainWindow.setFullScreen(
                        !this.mainWindow.isFullScreen()
                      );
                    }
                  }
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    if (this.mainWindow) {
                      this.mainWindow.webContents.toggleDevTools();
                    }
                  }
                }
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    if (this.mainWindow) {
                      this.mainWindow.setFullScreen(
                        !this.mainWindow.isFullScreen()
                      );
                    }
                  }
                }
              ]
      },
      {
        label: 'Help',
        submenu: [
          {
            visible: this.appUpdaterEnable,
            label: 'Check For Updates',
            click: () => {
              this.autoAppUpdate.forceCheck();
            }
          },
          {
            label: 'Privacy Policy',
            click: () => {
              privacyPolicyWindow();
            }
          }
        ]
      }
    ];
  }
}
