//background.js
//文件头部，引用增加ipcMain用于通信
'use strict'
import path from 'path';
import { app, protocol, BrowserWindow,Menu } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'


// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  const win = new BrowserWindow({
    width: 1100, //窗口默认宽度
    height: 650, //窗口默认高度
    useContentSize: false, 
    frame: true, //取消window自带的关闭最小化等
    resizable: true, //禁止改变主窗口尺寸
    transparent: false, //透明
    hasShadow: true, //窗口阴影
    maximizable: true,  //是否允许最大化
    sandbox: false,
    icon: path.join(__dirname, '../game.ico') , // Windows下使用.icos
    webPreferences: {
      enableRemoteModule:true, //在渲染进程启用remote模块
      nodeIntegration: true, //在渲染进程启用Node.js
      contextIsolation:false,
      webSecurity: false,
    }
  })
  //由于渲染进程中electron.remote已废弃，需要手动引入，并在每一个browserwindow中启用remote
  require('@electron/remote/main').initialize()
  require("@electron/remote/main").enable(win.webContents);
  //初始化controller
  require('./controller/windowIPC.js')
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
app.on('ready', async () => {
  createWindow()
  Menu.setApplicationMenu(null);
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}



