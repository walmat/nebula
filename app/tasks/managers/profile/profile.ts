import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import { Profiles, Profile } from './typings';
import { IPCKeys } from '../../../constants/ipc';

export class ProfileManager {
  mainWindow: BrowserWindow | null;

  profiles: Profiles;

  constructor(mainWindow: BrowserWindow | null) {
    this.mainWindow = mainWindow;
    this.profiles = {};

    ipcMain.on(IPCKeys.AddProfiles, this.registerAll);
    ipcMain.on(IPCKeys.RemoveProfiles, this.deregisterAll);
  }

  /**
   * Registers a profile to the main process
   * @param id - profile id
   * @param profile - profile
   */
  register = async (profile: Profile) => {
    if (!profile?.id) {
      return;
    }

    const { id } = profile;
    this.profiles[id] = profile;
  };

  /**
   * Deregisters a previously registered profile from the main process
   * @param id - profile id
   */
  deregister = async ({ id }: Profile) => {
    delete this.profiles[id];
  };

  /**
   * Retrieves a profile given an id
   * @param id - profile id
   */
  retrieve = (id: string) => {
    return this.profiles[id];
  };

  /**
   * Registers a list or singular profile on the main process
   * @param proxies - Proxy/Proxies group(s) to register
   */
  registerAll = (_: IpcMainEvent, profiles: Profile[] | Profile) => {
    if (Array.isArray(profiles)) {
      return Promise.all(profiles.map(profile => this.register(profile)));
    }

    return this.register(profiles);
  };

  /**
   * Deregisters a previously loaded profile (or profiles) from the main process
   * @param profiles - profile(s)
   */
  deregisterAll = (_: IpcMainEvent, profiles: Profile[] | Profile) => {
    if (Array.isArray(profiles)) {
      return Promise.all(profiles.map(profile => this.deregister(profile)));
    }

    return this.deregister(profiles);
  };
}
