import {Injectable, OnInit} from '@angular/core';
import {Server} from "../models/server";
import {Observable, ReplaySubject} from "rxjs";
import {shareReplay} from "rxjs/operators";
import {IpcService} from "./ipc.service";

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private subject: ReplaySubject<Server[]>
  private observer: Observable<Server[]>;

  private servers: Server[] = []

  private logs: {[serverId: number]: string[]} = {};

  getServerById(id: number): Server|undefined {
    return this.servers.find(value => {
      return value.id == id;
    })
  }

  openServerFolder(serverId: number) {
    return this.ipcService.ipcPromise('open-server', serverId);
  }

  addServer(server: Server) {
    this.servers.push(server);
    this.subject.next(this.servers);
  }

  async removeServerById(id: number) {
    if (id !== -1) {
      await this.ipcService.ipcPromise('delete-server', id)
    }
    this.servers = this.servers.filter(value => value.id != id);
    this.subject.next(this.servers);
  }

  prepareServerCreation() {
    const server = this.getServerById(-1);
    if (server) {
      return;
    }
    this.addServer({
      id: -1,
      processState: "offline",
      name: ''
    });

    setTimeout(() => {
      const element = document.querySelector('#server-name--1') as HTMLInputElement;
      element.focus({
        preventScroll: false
      });
    }, 50)
  }

  async createServer(name: string) {
    const server = await this.ipcService.ipcPromise('create-server', name);
    console.log({createdServer: server});
    this.updateServer(-1, {
      id: server.id,
      name
    })
  }

  updateServer(serverId: number, data: Partial<Server>) {
    const index = this.servers.findIndex((server) => server.id === serverId);

    if (index === -1) {
      return;
    }

    for (const key of Object.keys(data)) {
      const val = data[key];
      this.servers[index][key] = val;
    }

    this.subject.next(this.servers);

  }

  startServer(serverId: number) {
    return this.ipcService.ipcPromise('start-server', serverId);
  }

  stopServer(serverId: number) {
    return this.ipcService.ipcPromise('stop-server', serverId);
  }

  constructor(
    private ipcService: IpcService
  ) {
    this.subject = new ReplaySubject<Server[]>();
    this.observer = this.subject.pipe(
      shareReplay()
    );
    this.subject.next(this.servers);
    this.ipcService.ipcPromise('list-servers').then(servers => {
      this.servers = servers;
      this.subject.next(this.servers);
    });

    this.ipcService.ipc.answerMain<{serverId: number, line: string}>('server-log-line', ({serverId, line}) => {
      console.log({serverId, line});
      if (!this.logs[serverId]) {
        this.logs[serverId] = [line]
      } else {
        this.logs[serverId].push(line);
      }
    })
  }

  public getServerLogs(serverId: number): string[] {
    return this.logs[serverId] || [];
  }

  public getServers(): Observable<Server[]> {
    return this.observer;
  }

}
