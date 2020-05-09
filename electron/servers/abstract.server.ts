import {Server} from "../interfaces/server";
import * as path from 'path';
import * as fs from 'fs';
import * as http from "http";
import * as https from "https";
import {ServerStatus} from "../interfaces/server-status";

export abstract class AbstractServer {

  protected path: string;
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

  public abstract async postStart(): Promise<void>;

  public abstract async start(): Promise<void>;

  public abstract async stop(): Promise<void>;

  public abstract getServerStatus(): ServerStatus;

}
