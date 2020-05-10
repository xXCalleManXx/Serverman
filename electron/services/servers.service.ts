import {Injectable, OnApplicationShutdown, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import {Server} from "../interfaces/server";
import {SettingsService} from "./settings.service";
import * as fs from 'fs';
import {DatabaseService} from "./database.service";
import {IpcService} from "./ipc.service";
import {shell} from 'electron';
import {MinecraftServer} from "../servers/minecraft.server";
import {AbstractServer} from "../servers/abstract.server";
import {ServerStatus} from "../interfaces/server-status";
import {ServerLogService} from "./server-log.service";

@Injectable()
export class ServersService implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown {

  private serverHandlers: {[serverId: number]: AbstractServer} = {};

  constructor(
    private settingsService: SettingsService,
    private databaseService: DatabaseService,
    private ipcService: IpcService,
    private serverLogService: ServerLogService
  ) {
  }


  async onModuleDestroy(): Promise<any> {
    const handlers = Object.values(this.serverHandlers);

    if (handlers.length === 0) {
      return;
    }
    this.serverLogService.linesBeforePersist = 0;
    console.log('Stopping servers...');
    const promises = handlers.map((handler) => {
      console.log(`Stopping server #${handler.server.id}...`)
      return handler.stop();
    })
    await Promise.all(promises);

    console.log('All servers received exit code!');
  }

  getServerHandler(server: Server): AbstractServer {
    if (!this.serverHandlers[server.id]) {
      this.serverHandlers[server.id] = new MinecraftServer(this.getServerPath(server), server);
    }
    return this.serverHandlers[server.id];
  }

  onModuleInit(): any {
    this.ipcService.ipc.answerRenderer('create-server', async (name: string) => {
      return this.createServer({name} as Server);
    })
    this.ipcService.ipc.answerRenderer('list-servers', async () => {
      return this.getServers();
    })
    this.ipcService.ipc.answerRenderer<number>('delete-server', async (serverId) => {
      return this.deleteServer(serverId);
    })
    this.ipcService.ipc.answerRenderer<number>('open-server', async (serverId) => {
      return this.openServerDir(serverId);
    })
    this.ipcService.ipc.answerRenderer<number>('start-server', async (serverId) => {
      return this.startServerById(serverId)
    })
    this.ipcService.ipc.answerRenderer<number>('stop-server', async (serverId) => {
      return this.stopServerById(serverId)
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

  public async startServerById(serverId: number) {
    const server = this.getServerById(serverId);
    console.log(`starting server ${serverId}`, server);
    if (!server) {
      return;
    }
    return this.startServer(server);
  }

  public getServerStatus(server: Server): ServerStatus {
    const handler = this.getServerHandler(server);
    return handler.getServerStatus();
  }

  public async startServer(server: Server) {
    const handler = this.getServerHandler(server);
    await handler.postStart()
    await handler.start();
  }

  public async stopServerById(serverId: number) {
    const server = this.getServerById(serverId);
    if (!server) {
      return;
    }
    return this.stopServer(server);
  }

  public async stopServer(server: Server) {
    const handler = this.getServerHandler(server);
    await handler.stop();
  }

  public createServer(server: Server): Server {
    server.id = this.createServerId();
    if (this.serverFolderExists(server)) {
      throw new Error(`Folder for server #${server.id} already exists!`)
    }

    this.createServerFolder(server);
    this.persistServer(server);

    this.startServer(server);

    return server;
  }

}
