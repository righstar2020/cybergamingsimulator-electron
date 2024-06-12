// 界面与electron通信
const { ipcMain } = require('electron');
import windowManager from './windowManager.js';
ipcMain.on('open-new-window-by-local-url', (event, data) => {
  let devLocalServer = process.env.WEBPACK_DEV_SERVER_URL
  console.log(devLocalServer+data.url)
  let newWindow = windowManager.createNewWindowByUrl(data.title,devLocalServer+data.url);
});

ipcMain.on('open-frameless-window-by-local-url', (event, data) => {
  let devLocalServer = process.env.WEBPACK_DEV_SERVER_URL
  console.log(devLocalServer+data.url)
  let full_screen = false
  if(data.full_screen != undefined){
    full_screen = data.full_screen
    //full_screen = false
  }
  let newWindow = windowManager.createFramelessWindowByUrl(data.title,devLocalServer+data.url,full_screen);
});
function ipcInitSetup(){
  console.log('ipc listener setup success')
}
export default {
  ipcInitSetup
}