// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 导入刚才创建的路由实例
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//大屏展示
import dataV from '@jiaminghi/data-view'

const SSR = false
// 将Electron和fs绑定到Vue原型链上
const app = createApp(App)
//使用UI库
app.use(store) // 使用store
app.use(router) // 使用路由
app.use(ElementPlus)
app.use(dataV)
// 首先确保在Vue应用准备阶段获取Electron API
if (SSR === false) { // 非SSR情况下（仅客户端）
  // 注意Vue 3.x使用app.config.globalProperties
  const electron = window.require('electron')
  const { ipcRenderer, remote } = window.require('electron')
  const fs = window.require('fs')
  app.config.globalProperties.$electron = electron
  app.config.globalProperties.$ipcRenderer = ipcRenderer
  app.config.globalProperties.$fs = fs
  app.config.globalProperties.$remote = remote  
}
// 挂载Vue应用
app.mount('#app')
