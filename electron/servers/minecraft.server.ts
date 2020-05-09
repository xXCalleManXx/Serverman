import * as path from 'path';
import * as fs from 'fs';
import {AbstractServer} from "./abstract.server";
import * as child_process from 'child_process';
import {ServerStatus} from "../interfaces/server-status";

export class MinecraftServer extends AbstractServer {

  private process: child_process.ChildProcessWithoutNullStreams;

  protected getServerJarFileName(): string {
    return 'server.jar';
  }

  public async postStart() {
    const serverJarPath = path.join(this.path, this.getServerJarFileName());
    if (!fs.existsSync(serverJarPath)) {
      await this.downloadFile('https://cdn.getbukkit.org/spigot/spigot-1.15.2.jar', serverJarPath);
      console.log('Downloaded file...')
    }
  }

  public async start() {
    if (this.process) {
      console.log('Already started');
      // Already started!
      return;
    }
    console.log('Starting server');
    const memory = '1G'
    this.process = child_process.spawn(
      'java',
      [
        `-Xms${memory}`,
        `-Xmx${memory}`,
        '-jar',
        this.getServerJarFileName(),
        'nogui'
      ],
      {
        cwd: this.path
      }
    );

    this.process.stdout.on('data', (chunk: Buffer) => {
      const line = chunk.toString('utf-8');
      const obj = {};
      obj[`Server #${this.server.id}`] = line;
      console.log(obj);
    });

    this.process.on("exit", code => {
      console.log(`Server #${this.server.id} has stopped with code ${code}`);
      this.process = null;
    })
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
