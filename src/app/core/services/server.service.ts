import { Injectable } from '@angular/core';
import {Server} from "../models/server";
import {Observable, ReplaySubject} from "rxjs";
import {shareReplay} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private subject: ReplaySubject<Server[]>
  private observer: Observable<Server[]>;

  private servers: Server[] = [
    {
      id: 1,
      name: 'My Server #1',
      processState: 'online'
    },
    {
      id: 2,
      name: 'My Server #2',
      processState: 'offline'
    }
  ]

  getServerById(id: number): Server|undefined {
    return this.servers.find(value => {
      return value.id == id;
    })
  }

  addServer(server: Server) {
    this.servers.push(server);
    this.subject.next(this.servers);
  }

  removeServerById(id: number) {
    this.servers = this.servers.filter(value => value.id != id);
    this.subject.next(this.servers);
  }

  createNewServer() {
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

  constructor() {
    this.subject = new ReplaySubject<Server[]>();
    this.observer = this.subject.pipe(
      shareReplay()
    );
    this.subject.next(this.servers);

    (window as any).hehe = () => this.servers;
  }

  public getServers(): Observable<Server[]> {
    return this.observer;
  }

}
