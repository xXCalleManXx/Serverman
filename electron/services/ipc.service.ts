import {Injectable, OnModuleInit} from '@nestjs/common';
import { ipcMain } from 'electron';
import {UtilService} from "./util.service";

@Injectable()
export class IpcService implements OnModuleInit {

  constructor(
    private utilService: UtilService
  ) {
  }

  onModuleInit(): any {

    this.registerListener('retrieve-private-ip', async () => {
      return {
        privateIp: this.utilService.getPrivateIp()
      }
    })

  }

  registerListener(channel: string, listener: (...args: any[]) => PromiseLike<any>) {
    ipcMain.on(channel, async (event, args) => {
      const response = await listener(args);
      event.reply(`${channel}-reply`, response);
    })
  }

}
