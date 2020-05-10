import {Injectable} from '@nestjs/common';
import {UtilService} from "./util.service";
import * as path from 'path';

export interface AppSettings {
  appName: string;
  databasePath: string;
  serversFolder: string;
  serverLogsFolder: string;
  appPath: string;
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
    config.appPath = path.join(this.utilService.getHomeDir(), config.appName);
    config.databasePath = path.join(config.appPath, 'database.json');
    config.serversFolder = path.join(config.appPath, 'servers');
    config.serverLogsFolder = path.join(config.appPath, 'logs');

    this._config = config;

    return this._config;
  }

}
