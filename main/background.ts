import { BrowserWindow, app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import find from 'local-devices'

const isProd: boolean = process.env.NODE_ENV === 'production';

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
    frame: false,
    resizable: false,
    autoHideMenuBar: true,
    titleBarStyle: "customButtonsOnHover",
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
  event.returnValue = await getConnectedIPAddresses();
})
ipcMain.on("logoutSuccess", async () => {
  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
  }
  mainWindow.webContents.clearHistory();
  mainWindow.setMinimumSize(400, 450)
  mainWindow.setSize(400, 450, true)
  mainWindow.resizable = false;

}
)
ipcMain.on("goForward", () => {
  mainWindow.webContents.goForward();
}
)
ipcMain.on("goBack", () => {
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

  return (await find()).map(e=>e.ip);

}



