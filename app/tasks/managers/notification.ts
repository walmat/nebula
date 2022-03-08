import { BrowserWindow } from 'electron';
import { isEmpty } from 'lodash';

import { IPCKeys } from '../../constants/ipc';

type Notification = {
  id?: string;
  message: string;
  variant: string;
  type?: string;
  force?: boolean;
};

export class NotificationManager {
  notification: any;

  mainWindow: BrowserWindow | null;

  constructor(mainWindow: BrowserWindow | null) {
    this.notification = {};

    this.mainWindow = mainWindow;
  }

  notify = (notification: Notification) => {
    // send IPC to frontend to make the notification
    if (this.mainWindow) {
      this.mainWindow.webContents.send(IPCKeys.Notification, notification);
    }
  };

  insert = (notification: Notification) => {
    // if we already have a notification in the queue, return
    if (!isEmpty(this.notification)) {
      return;
    }

    this.notification = notification;
    // remove the notification in 2.5 seconds
    setTimeout(() => {
      this.notification = {};
    }, 1250);

    // send IPC to frontend to make the notification
    if (this.mainWindow) {
      this.mainWindow.webContents.send(IPCKeys.Notification, this.notification);
    }
  };

  clear = () => {
    this.notification = {};
  };
}
