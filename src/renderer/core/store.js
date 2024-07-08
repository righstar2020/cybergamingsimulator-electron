
import store from '../store/index.js'
import { update_background_server_url } from '../util/request.js'
//监听主进程发送来的消息
function setupListener(ipcRenderer) {
  ipcRenderer.on('vue_store_commint', (event, data) => {
    //console.log('main thread data:', data);
    let commit_name = data['commit_name']
    let commit_data = JSON.parse(data['data']) //反序列化数据
    store.commit(commit_name, commit_data);

    //如果是更新后台服务器地址
    if(commit_name == 'updateNetworkConfigData'){
      let url = commit_data['backgroundServerUrl']['value']
      console.log("new server url:",url)
      update_background_server_url(url)
    }

  });
}
//渲染进程发送消息给主进程
function setupStoreIPC(ipcRenderer){

}

export {
  setupListener,
  setupStoreIPC
}
