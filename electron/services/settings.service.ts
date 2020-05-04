import {Injectable, OnModuleInit} from '@nestjs/common';
import { ipcMain } from 'electron';
import {UtilService} from "./util.service";

export interface AppSettings {
  appName: string;
  databasePath: string;
  serversFolder: string;
}

@Injectable()
export class SettingsService {

  private _config;

  constructor(
    private utilService: UtilService
  ) {
  }

  public get config(): AppSettings {
    if (this._config) {
      return this._config;
    }
    const config = {} as AppSettings;

    config.appName = 'server-manager';
    config.databasePath = `${this.utilService.getHomeDir()}/${config.appName}/database.json`;
    config.serversFolder = `${this.utilService.getHomeDir()}/${config.appName}/servers`

    this._config = config;

    return this._config;
  }

}
