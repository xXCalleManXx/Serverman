import { Injectable } from '@nestjs/common';
const os = require('os');
const ifaces = os.networkInterfaces();

@Injectable()
export class UtilService {

  public getHomeDir() {
    return os.homedir();
  }

  public getPrivateIp() {
    const interfaces = []
    Object.keys(ifaces).forEach(function (ifname) {

      ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return;
        }

        interfaces.push({
          alias: ifname,
          address: iface.address
        });
      });
    });
    return interfaces;
  }

}
