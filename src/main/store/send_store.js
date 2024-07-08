import store from '../store';
import { deepCopy,formatTimestamp,formatTimestamp2 } from '../util';
function storeCommit(commit_name,data){
    let winds = global.winds
    //主进程存储一份数据
    store.commit(commit_name,data)
    //向每个窗口发送消息
    Object.values(winds).forEach(wind => {
        if(wind!=null){
            wind.webContents.send('vue_store_commint', {
                'commit_name':commit_name,
                'data':JSON.stringify(data) //序列化数据
            })
        }
           
    })      
}



// 广播task数据
function broadcastTaskData(player){
    let historyOperation = (player=='attacker'?
        deepCopy(store.getters.getAttackerHistoryOperation):
        deepCopy(store.getters.getDefenderHistoryOperation))
    let envStatusSummary = (player=='attacker'?
        deepCopy(store.getters.getAttackerEnvStatusSummary):
        deepCopy(store.getters.getDefenderEnvStatusSummary))
    let taskEnvStatus = (player=='attacker'?
        deepCopy(store.getters.getAttackerEnvStatus):
        deepCopy(store.getters.getDefenderEnvStatus))
    
      //历史任务列表
      storeCommit(
        (player == 'attacker'?
        'updateAttackerHistoryOperation':
        'updateDefenderHistoryOperation'),
        historyOperation
      )
      //摘要信息
      storeCommit(
        (player == 'attacker'?
        'updateAttackerEnvironmentStatusSummary':
        'updateDefenderEnvironmentStatusSummary'),
        envStatusSummary
      )
      //任务结果数据
      storeCommit(
            (player == 'attacker'?
            'updateAttackerEnvironmentStatusMap':
            'updateDefenderEnvironmentStatusMap'),
            taskEnvStatus
       )
      console.log('broadcastTaskData finished!',player)
}

//广播大屏展示数据
function broadcastLargeScreenData(){
  let taskHistoryData = store.getters.getTaskHistoryData
  let operation_rank_data = store.getters.getOperationRankData
  let headerDigitalData = store.getters.getHeaderDigitalData
  //大屏面板digital数据
  storeCommit('updateHeaderDigitalData',headerDigitalData)
  //历史任务数据
  storeCommit('updateTaskHistoryData',taskHistoryData)
  //排行榜数据
  storeCommit('updateOperationRankData',operation_rank_data)
}

// 广播全局数据
function broadcastGlobalData(){
    let globalData = store.getters.getGlobalData
    console.log('broadcastData:')
    storeCommit('updateGlobalData',globalData)
    broadcastTaskData('attacker')
    broadcastTaskData('defender')
    broadcastLargeScreenData()
}


export {
    broadcastGlobalData,
    storeCommit
}