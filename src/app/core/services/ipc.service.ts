import { Injectable } from '@angular/core';
import {ipcRenderer, RendererProcessIpc} from 'electron-better-ipc'

@Injectable({
  providedIn: 'root'
})
export class IpcService {

  constructor() {
  }

  get ipc(): RendererProcessIpc {
    return ipcRenderer;
  }

  async ipcPromise<T = any>(channel: string, data?): Promise<T> {
    return ipcRenderer.callMain(channel, data);
  }

}
