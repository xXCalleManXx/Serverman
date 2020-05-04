import {Injectable, OnModuleInit} from '@nestjs/common';
import {Server} from "../interfaces/server";
import {SettingsService} from "./settings.service";
import * as fs from 'fs';
import {DatabaseService} from "./database.service";
import {IpcService} from "./ipc.service";
import {shell} from 'electron';

@Injectable()
export class ServersService implements OnModuleInit {

  constructor(
    private settingsService: SettingsService,
    private databaseService: DatabaseService,
    private ipcService: IpcService
  ) {
  }

  onModuleInit(): any {
    this.ipcService.registerListener('create-server', async (name: string) => {
      return this.createServer({name} as Server);
    })
    this.ipcService.registerListener('list-servers', async () => {
      return this.getServers();
    })
    this.ipcService.registerListener('delete-server', async (serverId) => {
      return this.deleteServer(serverId);
    })
    this.ipcService.registerListener('open-server', async (serverId) => {
      return this.openServerDir(serverId);
    })
  }

  protected getServers(): Server[] {
    return this.databaseService.get('servers') || [];
  }

  public getServerById(serverId: number): Server|null {
    const servers = this.getServers();
    const serverIndex = servers.findIndex(value => value.id === serverId);
    if (serverIndex === -1) {
      return null;
    }

    return servers[serverIndex] || null;
  }

  protected openServerDir(serverId: number) {
    const server = this.getServerById(serverId);
    if (!server) {
      return;
    }
    const serverPath = this.getServerPath(server);
    if (!fs.existsSync(serverPath)) {
      return;
    }
    shell.openItem(serverPath);
  }

  protected persistServer(server: Server) {
    if (!server.id) {
      throw new Error('cannot persist server without id!')
    }
    const servers = this.getServers();
    const serverIndex = servers.findIndex(value => value.id === server.id);

    if (serverIndex === -1) {
      servers.push(server);
    } else {
      servers[serverIndex] = server;
    }

    this.databaseService.write('servers', servers);
  }

  protected deleteServer(serverId: number) {
    if (!serverId) {
      throw new Error('cannot delete server without id!')
    }
    const servers = this.getServers();
    const serverIndex = servers.findIndex(value => value.id === serverId);
    if (serverIndex === -1) {
      return;
    }
    const server = servers[serverIndex];
    servers.splice(serverIndex, 1);
    fs.rmdirSync(this.getServerPath(server), {recursive: true})
    this.databaseService.write('servers', servers);
  }

  protected createServerFolder(server: Server) {
    const serverPath = this.getServerPath(server);
    if (fs.existsSync(serverPath)) {
      return;
    }
    fs.mkdirSync(serverPath, {recursive: true})
  }

  protected getServerPath(server: Server) {
    return `${this.settingsService.config.serversFolder}/server_${server.id}`;
  }

  protected serverFolderExists(server: Server) {
    return fs.existsSync(this.getServerPath(server));
  }

  public createServerId() {
    const serverIds = this.getServers().map(server => server.id);

    let i = 1;

    while (serverIds.indexOf(i) !== -1) {
      i++;
    }

    return i;
  }

  public createServer(server: Server): Server {
    server.id = this.createServerId();
    if (this.serverFolderExists(server)) {
      throw new Error(`Folder for server #${server.id} already exists!`)
    }

    this.createServerFolder(server);
    this.persistServer(server);
    return server;
  }

}
