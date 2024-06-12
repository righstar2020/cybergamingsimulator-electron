const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  pluginOptions: {
    electronBuilder: {
      "customFileProtocol": "./", //增加此项让css中相对引用的文件能正常访问，否则一些css库中的字体会无法显示
      "builderOptions": {
        "extraResources": [
          "./html/**",
          "./src/assets/**", //这里指定外部资源文件夹，你可以把一些外部程序放在./extraResources中，比如ffmpeg等，打包时electron将直接原样拷贝
          "./node_modules/@electron/remote/**",//必须添加这一行否则remote会引用不到
        ],
        "productName": "CyberGamingSimulator",
        "appId": "your.app.appId",
        "copyright":"Copyright © rightstar 2024",// 版权信息
        "directories": {
          "output": "./build" //输出文件夹
        },
        "afterSign": "./notarize.js", //签名文件
        "dmg": { //输出mac的dmg时图标位置
          "contents": [
            {
              "x": 410,
              "y": 150,
              "type": "link",
              "path": "/Applications"
            },
            {
              "x": 130,
              "y": 150,
              "type": "file"
            }
          ]
        },
        "mac": {
          "icon": "./icons/icon512.icns",//mac图标，必须至少包含512*512尺寸的图标
          "target":[{
            "target": "dmg", //设置输出dmg安装包
            "arch": ["arm64", "x64"], //arm64是apple silicon机器专用的包；x64是intel版的包，两种电脑都能用，不过x64运行启动会慢一点；这里你可以填universal，这样会生成一个arm64+x64打出来然后装一起的一个包（体积也是两种应用之和），运行时会自动选择版本
          }],
          "identity": "cybergamingsimulator",
          "entitlements": "./entitlements.mac.plist", //签名必须
          "entitlementsInherit": "./entitlements.mac.inherit.plist",//签名必须
          "entitlementsLoginHelper": "./entitlements.mas.loginhelper.plist",//如果需要mac的mas版打包，则需要此项
        },
        "win": {
          "icon": "./game_thoery.ico",//win打包图标
          "target": [{
            "target": "nsis",// 利用 nsis 制作安装程序
            "arch": [
              "x64",//64 位
            ]
          }]
        },
        "nsis": {
          "oneClick": false, // 是否一键安装
          "allowElevation": true, // 允许请求提升. 如果为 false, 则用户必须使用提升的权限重新启动安装程序.
          "allowToChangeInstallationDirectory": true, // 允许修改安装目录
          "installerIcon": "./icons/icon256.ico",// 安装图标
          "uninstallerIcon": "./icons/icon256.ico",// 卸载图标
          "installerHeaderIcon": "./icons/icon256.ico", // 安装时头部图标
          "createDesktopShortcut": true, // 创建桌面图标
          "createStartMenuShortcut": true,// 创建开始菜单图标
          "shortcutName": "CyberGamingSimulator", // 图标名称
          "perMachine": true
        },
      }
    }
  },
  configureWebpack: config => {
    return {

    }//webpack相关配置
  }
})
