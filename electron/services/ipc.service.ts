import {Injectable, OnModuleInit} from '@nestjs/common';
import {UtilService} from "./util.service";
import {ipcMain, MainProcessIpc} from 'electron-better-ipc';
import {AppService} from "../app.service";

@Injectable()
export class IpcService implements OnModuleInit {

  constructor(
    private utilService: UtilService,
    private appService: AppService
  ) {
  }

  onModuleInit(): any {

    ipcMain.answerRenderer('retrieve-private-ip', () => {
      return {
        privateIp: this.utilService.getPrivateIp()
      }
    });

  }

  public emit(channel: string, data) {
    ipcMain.callRenderer(this.appService.window, channel, data);
  }

  get ipc(): MainProcessIpc {
    return ipcMain;
  }

}
