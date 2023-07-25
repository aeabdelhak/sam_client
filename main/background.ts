import { BrowserWindow, app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import find from 'local-devices'
import { exec } from "child_process"
const isProd: boolean = process.env.NODE_ENV === 'production';
const isMacOS = process.platform === 'darwin';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}
let mainWindow: BrowserWindow
(async () => {
  await app.whenReady();

  mainWindow = createWindow('main', {
    width: 400,
    height: 450,
    frame: true,
    resizable: false,
    autoHideMenuBar: true,
    titleBarStyle: "default",
    webPreferences: {
      scrollBounce: true,
    }
  });


  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);

  }
})();
ipcMain.on("loginSuccess", () => {
  mainWindow.webContents.clearHistory();
  mainWindow.resizable = true;
  mainWindow.setSize(1400, 700, true)
  mainWindow.setMinimumSize(1400, 700)
})
ipcMain.on("remoteLockUp", async (event) => {
  const connected = await getConnectedIPAddresses()
  event.returnValue = connected;
})
ipcMain.on("logoutSuccess", async () => {
  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
  }

}
)
ipcMain.on("init", async () => {

  mainWindow.webContents.clearHistory();
  mainWindow.setMinimumSize(400, 450)
  mainWindow.setSize(400, 450, true)
  mainWindow.resizable = false;

}
)
ipcMain.on("goForward", () => {
  mainWindow.webContents.send("zoom", true)
  mainWindow.webContents.goForward();
}
)
ipcMain.on("zoom", (event, data) => {
  mainWindow.webContents.send("zoom", data)
})
ipcMain.on("goBack", () => {
  mainWindow.webContents.send("zoom", false)
  mainWindow.webContents.goBack();
}
)

ipcMain.on("routeChange", () => {
  canGoForward()
  canGoBack()
})

function canGoForward() {
  mainWindow.webContents.send('canGoForward', mainWindow.webContents.canGoForward())
}
function canGoBack() {
  mainWindow.webContents.send('canGoBack', mainWindow.webContents.canGoBack())
}

app.on('window-all-closed', () => {
  app.quit();
});

async function getConnectedIPAddresses() {
  if (isMacOS)
    return (await find()).map(e => e.ip);
    return await getConnectedDevices();
}

async function resize({ width, height }: { width, height }) {

}

function getConnectedDevices() {
  return new Promise((resolve, reject) => {
    exec('arp -a', (err, stdout) => {
      if (err) {
        reject('Error executing ARP command:' + err);
        return;
      }

      const lines = stdout.split('\n');
      const connectedDevices = [];

      lines.forEach((line) => {
        const match = line.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/);
        if (match) {
          connectedDevices.push(match[0]);
        }
      });
      resolve(connectedDevices)

    });
  })
}


