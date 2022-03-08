import {
  existsSync as _existsSync,
  writeFile as _writeFileAsync,
  appendFile as _appendFileAsync,
  readFileSync as _readFileSync,
  writeFileSync as _writeFileSync
} from 'fs';
import { EOL } from 'os';
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';

export const writeFileAsync = (filePath: string, text: string) => {
  const options = { mode: 0o755 };
  _writeFileAsync(filePath, text, options, err => {
    if (err) {
      console.error(err, `writeFileAsync`);
    }
  });
};

export const writeFileSync = (filePath: string, text: string) => {
  const options = { mode: 0o755 };
  try {
    _writeFileSync(filePath, text, options);
  } catch (err) {
    console.error(err, `writeFileSync`);
  }
};

export const appendFileAsync = (filePath: string, text: string) => {
  const options = { mode: 0o755 };
  _appendFileAsync(filePath, text + EOL, options, err => {
    if (err) {
      console.error(err, `appendFileAsync`);
    }
  });
};

export const readFileSync = (filePath: string) => {
  const options = { encoding: 'utf8' };
  return _readFileSync(filePath, options);
};

export const fileExistsSync = (filePath: string) => _existsSync(filePath);

export const createDirSync = (newFolderPath: string) => {
  mkdirp.sync(newFolderPath);
};

export const deleteFilesSync = (filePath: string) => {
  rimraf.sync(filePath);
};
