import {app, BrowserWindow, screen, ipcMain} from 'electron';
import * as url from "url";
import * as path from "path";
const os = require('os');
const ifaces = os.networkInterfaces();

class ElectronApp {

  private window: BrowserWindow;
  private isServing: boolean;

  constructor(isServing: boolean) {
    this.isServing = isServing;
  }

  start() {
    app.allowRendererProcessReuse = true;

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
    app.on('ready', () => setTimeout(() => this.createWindow(), 400));

    // Quit when all windows are closed.
    app.on('window-all-closed', () => {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });

    app.on('activate', () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (!this.window) {
        this.createWindow()
      }
    });



    ipcMain.on('retrieve-private-ip', event => {
      event.reply('retrieve-private-ip-reply', {
        privateIp: this.getPrivateIp()
      })
    })
  }

  createWindow(): BrowserWindow {

    if (this.window) {
      return this.window;
    }

    const size = screen.getPrimaryDisplay().workAreaSize;

    // Create the browser window.
    const win = new BrowserWindow({
      x: 0,
      y: 0,
      width: size.width,
      height: size.height,
      webPreferences: {
        nodeIntegration: true,
        allowRunningInsecureContent: this.isServing,
      },
    });

    if (this.isServing) {

      require('devtron').install();
      win.webContents.openDevTools();

      require('electron-reload')(__dirname, {
        electron: require(`${__dirname}/node_modules/electron`)
      });
      win.loadURL('http://localhost:4200');

    } else {
      win.loadURL(url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
      }));
    }

    // Emitted when the window is closed.
    win.on('closed', () => {
      // Dereference the window object, usually you would store window
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      this.window = null;
    });

    this.window = win;

    return win;
  }


  getPrivateIp() {
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

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

const electronApp = new ElectronApp(serve);

try {

  electronApp.start();

} catch (e) {
  console.error(e);
  // Catch Error
  // throw e;
}
