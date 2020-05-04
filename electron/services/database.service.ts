import {Injectable, OnModuleInit} from '@nestjs/common';
import {SettingsService} from "./settings.service";
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

@Injectable()
export class DatabaseService implements OnModuleInit {

  protected database: Object;

  constructor(
    private settingsService: SettingsService
  ) {
  }

  protected configExists() {
    return fs.existsSync(this.settingsService.config.databasePath)
  }

  protected initializeConfig() {
    if (this.configExists()) {
      return;
    }
    const databasePath = this.settingsService.config.databasePath;
    const folder = path.dirname(databasePath);

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, {recursive: true});
    }

    this.database = {};
    this.persistDatabase();
  }

  protected initializeInMemoryDB() {
    if (!this.configExists()) {
      return;
    }
    const content = fs.readFileSync(this.settingsService.config.databasePath).toString('utf-8');
    this.database = JSON.parse(content);
  }

  protected persistDatabase() {
    const path = this.settingsService.config.databasePath;
    fs.writeFileSync(path, JSON.stringify(this.database, null, '  '));
  }

  public write(path: string, value: any) {
    this.database = _.set(this.database, path, value);
    this.persistDatabase()
  }

  public get(path: string) {
    return _.get(this.database, path);
  }

  onModuleInit(): any {
    if (!this.configExists()) {
      this.initializeConfig();
    }
    this.initializeInMemoryDB();
  }

}
