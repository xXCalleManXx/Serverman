import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

@Injectable({
  providedIn: 'root'
})
export class IpcService {
  private _ipc: IpcRenderer | undefined = void 0;

  constructor() {
    if (window.require) {
      try {
        this._ipc = window.require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('Electron\'s IPC was not loaded');
    }
  }

  async ipcPromise<T = any>(channel: string, ...args: any[]): Promise<T> {
    return new Promise((resolve, reject) => {
      this._ipc.send(channel, ...args);
      this._ipc.once(`${channel}-reply`, (event, args) => {
        console.log({event, args});
        resolve(args);
      })
    })
  }

}
