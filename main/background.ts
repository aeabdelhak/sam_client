import { BrowserWindow, app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import find from 'local-devices'
import { exec } from "child_process"
import fetch from 'electron-fetch'
import Store from "electron-store"
const isProd: boolean = process.env.NODE_ENV === 'production';
const isMacOS = process.platform === 'darwin';
const store = new Store()
if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}
let mainWindow: BrowserWindow
(async () => {
  await app.whenReady();
  mainWindow = createWindow('main', {

    frame: false,
    resizable: false,
    autoHideMenuBar: true,
    titleBarStyle: "default",
    webPreferences: {
      scrollBounce: true,
    }
  });
  const authToken = store.get("authToken");

  if (isProd) {
    if (!authToken) {
      mainWindow.setSize(400, 450, true)
      await mainWindow.loadURL('app://./home.html');
    }
    else {
      await mainWindow.loadURL('app://./menu.html');
    }

  } else {
    const port = process.argv[2];
    if (!authToken) {
      mainWindow.setSize(400, 450, true)
      await mainWindow.loadURL(`http://localhost:${port}/home`);
    }
    else {
      await mainWindow.loadURL(`http://localhost:${port}/menu`);
    }

  }
})();

ipcMain.on("loginSuccess", (ev, data) => {
  store.set("authToken", data);
  mainWindow.webContents.clearHistory();
  mainWindow.resizable = true;
  mainWindow.setSize(1200, 600, true)
  mainWindow.setMinimumSize(1200, 600)
  mainWindow.center()

})
ipcMain.on("remoteLockUp", async (event) => {
  const connected = await getConnectedIPAddresses()
  let found = false;
  await Promise.all((connected as string[]).map(async ip => {
    try {
      const abortController = new AbortController()
      setTimeout(() => {
        abortController.abort()
      }, 500);
      const url = "http://" + ip + ":4000/connect"
      const data = await (await fetch(url, {
        signal: abortController.signal
      })).json()
      if (data == true) {
        found = true;
        event.returnValue = ip;
        store.set("remoteIp", ip)
      }
    } catch (error) {
    }
  }))
  if (!found)
    event.returnValue = null;


})
ipcMain.on("minimizeApp", async (event) => {
  mainWindow.minimize();
  ;
})
ipcMain.on("closeApp", async (event) => {
  app.quit();
  ;
})
ipcMain.on("maximizeApp", async (event) => {
  isMacOS ? mainWindow.fullScreen = !mainWindow.isFullScreen() : mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
})
ipcMain.on("maximizeAppOnly", async (event) => {
  mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
})
ipcMain.on("logoutSuccess", async (ev, data) => {
  store.has("authToken") && store.delete("authToken");
  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);
  }

}
)

ipcMain.on("getToken", (ev) => {
  ev.returnValue = store.get("authToken")
})

ipcMain.on("getRemoteIp", (ev) => {
  ev.returnValue = store.get("remoteIp")
})
ipcMain.on("setRemoteIp", async (ev, data) => {
  const url = "http://" + data + ":4000/connect"
  try {
    const res = await (await fetch(url)).json()
    if (res == true) {
      store.set("remoteIp", data);
      return ev.returnValue = true;
    }
    ev.returnValue = false;
  } catch (error) {
    ev.returnValue = false;
  }


})


ipcMain.on("init", async () => {

  mainWindow.webContents.clearHistory();
  mainWindow.setMinimumSize(400, 450)
  mainWindow.setSize(400, 450, true)
  mainWindow.center()
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


