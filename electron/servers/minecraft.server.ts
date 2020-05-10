import * as path from 'path';
import * as fs from 'fs';
import {AbstractServer} from "./abstract.server";
import * as child_process from 'child_process';

export class MinecraftServer extends AbstractServer {

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

  createChildProcess(): Promise<child_process.ChildProcessWithoutNullStreams> | child_process.ChildProcessWithoutNullStreams {
    const memory = '1G'
    return child_process.spawn(
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
  }

}
