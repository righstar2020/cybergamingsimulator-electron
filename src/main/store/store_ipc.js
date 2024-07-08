
import store from '../store';
import { storeCommit } from './send_store.js'
import { update_background_server_url } from '../util/request.js'
const { ipcMain } = require('electron');
ipcMain.on('send_store_commit_data_to_main', async (event, data) => {
    let commit_name = data['commit_name']
    let commit_data = JSON.parse(data['data']) //从渲染进程传来的数据会先被stringfly
    //主进程存储数据
    store.commit(commit_name,commit_data)
    //所有子进程同步数据
    storeCommit(commit_name,commit_data)
    //如果是更新后台服务器地址
    if(commit_name == 'updateNetworkConfigData'){
        let url = commit_data['backgroundServerUrl']['value']
        console.log("new server url:",url)
        update_background_server_url(url)
    }
});
