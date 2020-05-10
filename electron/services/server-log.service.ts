import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import {SettingsService} from "./settings.service";
import * as fs from 'fs';
import * as path from 'path';
import {IpcService} from "./ipc.service";

@Injectable()
export class ServerLogService implements OnModuleInit, OnModuleDestroy {

  protected serverLines: {[serverId: number]: string[]} = {};
  private _linesBeforePersist;

  constructor(
    private settingsService: SettingsService
  ) {
  }

  onModuleInit(): any {
    setInterval(() => {
      this.persistAllServerLines();
    }, 10000);
  }

  get linesBeforePersist() {
    return this._linesBeforePersist;
  }

  set linesBeforePersist(value) {
    this._linesBeforePersist = value;
  }

  public resetLinesBeforePersist() {
    this._linesBeforePersist = 20;
  }

  async onModuleDestroy(): Promise<void> {
    console.log('Saving server logs');
    this.persistAllServerLines();
  }

  protected persistAllServerLines() {
    const serverIds = Object.keys(this.serverLines) as any as number[];

    for (const serverId of serverIds) {
      this.persistServerLines(serverId);
    }

  }

  public processLine(serverId: number, line: string) {
    if (!this.serverLines[serverId]) {
      this.serverLines[serverId] = [line];
    } else {
      this.serverLines[serverId].push(line);
    }

    if (this.serverLines[serverId].length >= this.linesBeforePersist) {
      this.persistServerLines(serverId);
    }
  }

  protected persistServerLines(serverId: number) {
    this.initLogsFolder();

    const serverLines = this.serverLines[serverId];
    this.serverLines[serverId] = [];

    if (!serverLines) {
      return;
    }

    const file = this.getLogFilePath(serverId);

    const lines = serverLines.join('');

    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, lines);
    } else {
      fs.appendFileSync(file, lines)
    }
  }

  protected getLogFilePath(serverId) {
    return path.join(this.logsFolder, `server_${serverId}.log`);
  }

  protected initLogsFolder() {
    if (!fs.existsSync(this.logsFolder)) {
      fs.mkdirSync(this.logsFolder, {recursive: true})
    }
  }

  get logsFolder()  {
    return this.settingsService.config.serverLogsFolder;
  }

}
