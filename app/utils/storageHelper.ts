import { PATHS } from './paths';
import Storage from '../classes/Storage';

const { settingsFile, authFile } = PATHS;

export const authStorage = new Storage(authFile);
export const settingsStorage = new Storage(settingsFile);
