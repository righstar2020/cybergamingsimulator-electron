//background.js
//文件头部，引用增加ipcMain用于通信
'use strict'
import path from 'path';
import { app, protocol, BrowserWindow,Menu  } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import setupBackground from './preload/preload.js'
import { broadcastGlobalData } from './store/send_store';  
const isDevelopment = process.env.NODE_ENV !== 'production'
global.isDevelopment = !isDevelopment
// 注册一个vue app协议
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
global.winds = {}
function addGlobalWindow(wind){
  let wins = global.winds
  let windowID = "window"+Object.keys(wins).length
  global.winds[windowID] = wind
  return windowID
}
function removeGlobalWindow(id){
  global.winds[id] = null
}
async function createWindow() {
  let win = new BrowserWindow({
    width: 1100, //窗口默认宽度
    height: 650, //窗口默认高度
    useContentSize: true, 
    frame: true, //取消window自带的关闭最小化等
    resizable: true, //禁止改变主窗口尺寸
    transparent: false, //透明
    hasShadow: true, //窗口阴影
    maximizable: true,  //是否允许最大化
    sandbox: false,
    icon: path.join(__dirname, '../public/game.ico') , // Windows下使用.icos
    webPreferences: {
      enableRemoteModule:true, //在渲染进程启用remote模块
      nodeIntegration: true, //在渲染进程启用Node.js
      contextIsolation:false,
      webSecurity: false,
    }
  })
  //初始化后台进程
  setupBackground()
  //启动窗口(dev or production)
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (global.isDevelopment) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    await win.loadURL('app://./index.html')
  }
  let winID = addGlobalWindow(win)
  win.on("closed", () => {
    removeGlobalWindow(winID)
  });
  //广播全局数据
  broadcastGlobalData()
  return win
}
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', async () => {
  if (BrowserWindow.getAllWindows().length === 0){
    createWindow()
  } 
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
