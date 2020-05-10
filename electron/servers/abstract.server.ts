import {Server} from "../interfaces/server";
import * as fs from 'fs';
import * as http from "http";
import * as https from "https";
import {ServerStatus} from "../interfaces/server-status";
import * as child_process from 'child_process';
import {GetApp} from "../nestjs";
import {ServerLogService} from "../services/server-log.service";
import {IpcService} from "../services/ipc.service";

export abstract class AbstractServer {

  protected path: string;
  protected process: child_process.ChildProcessWithoutNullStreams;
  private _server: Server;

  constructor(path: string, server: Server) {
    this.path = path;
    this._server = server;
  }

  get server(): Server {
    return this._server;
  }

  protected async downloadFile(url: string, filename: string) {
    const file = fs.createWriteStream(filename);
    const module = url.indexOf('https://') === 0 ? https : http;
    const request = module.get(url, function(response) {
      response.pipe(file);
    });

    return new Promise(resolve => {
      request.on('close', () => resolve())
    })

  }

  public abstract createChildProcess(): Promise<child_process.ChildProcessWithoutNullStreams>|child_process.ChildProcessWithoutNullStreams;
  public abstract async postStart(): Promise<void>;

  public async start() {
    if (this.process) {
      console.log('Already started');
      // Already started!
      return;
    }
    console.log('Starting server');
    this.process = await this.createChildProcess();

    this.process.stdout.on('data', (chunk: Buffer) => {
      const line = chunk.toString('utf-8');
      console.log({[`Server #${this.server.id}`]: line});
      this.serverLogService.processLine(this.server.id, line);
      this.ipcService.emit(`server-log-line`, {
        serverId: this.server.id,
        line
      });
    });

    this.process.on("exit", code => {
      console.log(`Server #${this.server.id} has stopped with code ${code}`);
      this.process = null;
    })
  }

  protected get ipcService(): IpcService {
    return GetApp().get(IpcService);
  }

  protected get serverLogService(): ServerLogService {
    return GetApp().get(ServerLogService);
  }

  public async stop() {
    if (!this.process) {
      return;
    }
    this.process.kill('SIGTERM');
  }

  getServerStatus(): ServerStatus {
    if (this.process?.pid) {
      return 'online'
    }
    return 'offline';
  }

}
