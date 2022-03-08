import { log } from '../utils/log';
import {
  readFileSync,
  writeFileSync,
  deleteFilesSync
} from '../api/sys/fileOps';

export default class Storage {
  filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  getAll() {
    try {
      const _stream = readFileSync(this.filePath);
      if (
        typeof _stream === 'undefined' ||
        _stream === null ||
        Object.keys(_stream).length < 1
      ) {
        return {};
      }
      return JSON.parse(_stream);
    } catch (e) {
      log.error(e, `Storage -> getAll`);
    }
  }

  getItem(key: string) {
    try {
      if (typeof key === 'undefined' || key === null) {
        return null;
      }

      // get all items
      const allItems = this.getAll();

      if (allItems[key]) {
        return allItems[key];
      }

      return null;
    } catch (e) {
      log.error(e, 'Storage -> getItem');
    }
  }

  getItems(keys: any) {
    try {
      if (typeof keys === 'undefined' || keys === null || keys.length < 0) {
        return {};
      }

      const allItem = this.getAll();
      const _return: any = {};

      // eslint-disable-next-line array-callback-return
      keys.map((a: any) => {
        if (typeof allItem[a] === 'undefined' || allItem[a] === null) {
          return;
        }

        _return[a] = allItem[a];
      });

      return _return;
    } catch (e) {
      log.error(e, `Storage -> getAll`);
      return null;
    }
  }

  setAll({ ...data }) {
    try {
      writeFileSync(this.filePath, JSON.stringify({ ...data }));
    } catch (e) {
      log.error(e, `Storage -> setAll`);
    }
  }

  set(key: string, value: any) {
    try {
      // get all items
      const allItems = this.getAll();

      // update / set the item
      allItems[key] = value;

      // write back to file
      this.setAll({ ...allItems });
    } catch (e) {
      log.error(e, 'Storage -> set');
    }
  }

  delete() {
    try {
      deleteFilesSync(this.filePath);
    } catch (e) {
      log.error(e, 'Storage -> delete');
    }
  }
}
