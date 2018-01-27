'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
const {download} = require('electron-dl');

require('electron-debug')({showDevTools: true, electronDebug: true});


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)
  // mainWindow.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('session-created', (session) => {
  session.on('will-download', (e, item, contents) => {
    let hostWebContents = contents;
    if (contents.getType() === 'webview') {
      const hostWebContents = contents.hostWebContents;
    }
    const hostWin = BrowserWindow.fromWebContents(hostWebContents);
  });
});

ipcMain.on('download-btn', (e, args) => {
  console.log(args)
  download(BrowserWindow.getFocusedWindow(), args, {saveAs : true})
    .then(dl => console.log(dl))
    .catch(console.error);
});

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })
app.on('window-all-closed', app.quit);

app.on('before-quit', () => {
    mainWindow.removeAllListeners('close');
    mainWindow.close();
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// SQLIte stuff
let server = require('../server/server.js')
// SQLIte stuff

let onlineStatusWindow

app.on('ready', () => {
  onlineStatusWindow = new BrowserWindow({ show: false})
})

// ipcMain.on('online-status-changed', (event, status) => {
//   console.log(status)
//   console.log(server)
//   console.log(onlineStatusWindow)
// })

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
