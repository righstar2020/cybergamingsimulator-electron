// newWindowManager.js
const { BrowserWindow } = require('electron');
function createNewWindow(title='') {
  const newWindow = new BrowserWindow({
    title: title,
    width: 800,
    height: 600,
    icon: __dirname + '../assets/icon/game_thoery.ico', // Windows下使用.ico
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  // 加载新窗口的内容
  newWindow.loadURL(`file://${__dirname}/index.html`);
  // 其他窗口配置...
  return newWindow; // 如果需要返回窗口实例做进一步操作的话
}

function createNewWindowByStaticFile(title='',filePath) {
    const newWindow = new BrowserWindow({
        title: title,
        width: 800,
        height: 600,
        useContentSize: false, 
        frame: true, //取消window自带的关闭最小化等
        resizable: true, //禁止改变主窗口尺寸
        transparent: false, //透明
        hasShadow: true, //窗口阴影
        maximizable: true,  //是否允许最大化
        sandbox: false,
        webPreferences: {
            enableRemoteModule:true, //在渲染进程启用remote模块
            nodeIntegration: true, //在渲染进程启用Node.js
            contextIsolation:false,
            webSecurity: false,
        }
    });
  
    // 加载新窗口的内容
    newWindow.loadURL(`file://${__dirname}/${filePath}`);
    // 自动打开DevTools（仅在开发阶段）
    if (process.env.NODE_ENV !== 'production') {
        newWindow.webContents.openDevTools()
    }
    // 其他窗口配置...
    return newWindow; // 如果需要返回窗口实例做进一步操作的话
  }
function createNewWindowByUrl(title,url){
      console.log(url)
      const newWindow = new BrowserWindow({
        title:title,
        width: 800,
        height: 600,
        useContentSize: false, 
        frame: true, //取消window自带边框
        resizable: true, //禁止改变主窗口尺寸
        transparent: false, //透明
        hasShadow: true, //窗口阴影
        maximizable: true,  //是否允许最大化
        sandbox: false,
        webPreferences: {
            nodeIntegration: true, //在渲染进程启用Node.js
            contextIsolation:false,
            webSecurity: false,
          }
    });
    // 加载新窗口的内容
    
    newWindow.loadURL(url);
    // 自动打开DevTools（仅在开发阶段）
    if (process.env.NODE_ENV !== 'production') {
        newWindow.webContents.openDevTools()
    }
    // // 其他窗口配置...

    return newWindow; // 如果需要返回窗口实例做进一步操作的话
}
function createFramelessWindowByUrl(title,url,full_screen){
  console.log(url)
  const newWindow = new BrowserWindow({
    title:title,
    width: 800,
    height: 600,
    useContentSize: false, 
    transparent: true,
    backgroundColor:'rgba(0,0,0,0)',
    frame:false,
    hasShadow: true, //窗口阴影
    maximizable: true,  //是否允许最大化
    fullscreen: full_screen, // 设置窗口为全屏
    kiosk: full_screen&&process.platform === 'win32', // 在Windows平台上启用kiosk模式以覆盖任务栏
    sandbox: false,
    webPreferences: {
        nodeIntegration: true, //在渲染进程启用Node.js
        contextIsolation:false,
        webSecurity: false,
      }
});
// 加载新窗口的内容

newWindow.loadURL(url);
// 自动打开DevTools（仅在开发阶段）
if (process.env.NODE_ENV !== 'production') {
    newWindow.webContents.openDevTools()
}
// // 其他窗口配置...

return newWindow; // 如果需要返回窗口实例做进一步操作的话
}
// 或者，如果你使用ES6模块
export default {
  createNewWindow,
  createNewWindowByStaticFile,
  createNewWindowByUrl,
  createFramelessWindowByUrl
};

