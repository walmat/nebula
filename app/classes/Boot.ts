/* eslint no-await-in-loop: off */

/**
 * Boot
 * Note: Don't import log helper file from utils here
 */

import { readdirSync } from 'fs';
import { baseName, PATHS } from '../utils/paths';
import {
  fileExistsSync,
  writeFileAsync,
  createDirSync,
  deleteFilesSync
} from '../api/sys/fileOps';
import { daysDiff, yearMonthNow } from '../utils/date';
import { LOG_FILE_ROTATION_CLEANUP_THRESHOLD } from '../constants';

const { logFile, settingsFile, authFile, logDir } = PATHS;
const logFileRotationCleanUpThreshold = LOG_FILE_ROTATION_CLEANUP_THRESHOLD;

export default class Boot {
  verifyDirList: string[];

  verifyFileList: string[];

  settingsFile: string;

  authFile: string;

  constructor() {
    this.verifyDirList = [logDir];
    this.verifyFileList = [logFile, settingsFile, authFile];
    this.settingsFile = settingsFile;
    this.authFile = authFile;
  }

  async init() {
    try {
      for (let i = 0; i < this.verifyDirList.length; i += 1) {
        const item = this.verifyDirList[i];

        if (!(await this.verifyDir(item))) {
          await this.createDir(item);
        }
      }

      if (!this.verifyFile(this.authFile)) {
        await this.createFile(this.authFile);
      }

      if (!this.verifyFile(this.settingsFile)) {
        await this.createFile(this.settingsFile);
      }

      for (let i = 0; i < this.verifyFileList.length; i += 1) {
        const item = this.verifyFileList[i];

        if (!this.verifyFile(item)) {
          await this.createFile(item);
        }
      }

      return;
    } catch (e) {
      console.error(e);
    }
  }

  async verify() {
    try {
      for (let i = 0; i < this.verifyFileList.length; i += 1) {
        const item = this.verifyDirList[i];

        if (!(await this.verifyDir(item))) {
          return;
        }
      }
      for (let i = 0; i < this.verifyFileList.length; i += 1) {
        const item = this.verifyFileList[i];

        if (!this.verifyFile(item)) {
          return;
        }
      }

      return;
    } catch (e) {
      console.error(e);
    }
  }

  quickVerify() {
    try {
      for (let i = 0; i < this.verifyFileList.length; i += 1) {
        const item = this.verifyFileList[i];

        if (!this.verifyFile(item)) {
          return false;
        }
      }

      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async verifyDir(filePath: string) {
    try {
      return fileExistsSync(filePath);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async createDir(newFolderPath: string) {
    try {
      createDirSync(newFolderPath);
    } catch (e) {
      console.error(e);
    }
  }

  verifyFile(filePath: string) {
    try {
      return fileExistsSync(filePath);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  createFile(filePath: string) {
    try {
      writeFileAsync(filePath, ``);
    } catch (e) {
      console.error(e);
    }
  }

  cleanRotationFiles() {
    try {
      const dirFileList = readdirSync(logDir);
      const pattern = `^\\${baseName(logFile)}`;
      const _regex = new RegExp(pattern, 'gi');
      const filesList = dirFileList.filter(elm => {
        return !elm.match(_regex);
      });

      if (filesList === null || filesList.length < 1) {
        return null;
      }

      filesList.map(async a => {
        const dateMatch = a.match(/\d{4}-\d{2}/g);
        if (
          dateMatch === null ||
          dateMatch.length < 1 ||
          typeof dateMatch[0] === 'undefined' ||
          dateMatch[0] === null
        ) {
          return;
        }

        const _diff = daysDiff(yearMonthNow({}), dateMatch[0]);
        if (_diff >= logFileRotationCleanUpThreshold) {
          deleteFilesSync(`${logDir}/${a}`);
        }
      });
      return null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
