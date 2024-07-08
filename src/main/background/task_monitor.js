import store from '../store';
import {storeCommit} from '../store/send_store.js';
import {request_get,request_post} from '../util/request.js';
import { deepCopy,formatTimestamp,formatTimestamp2 } from '../util';
import {getObjectHash} from '../util/crypto.js' //判断数据是否有更新

function updateStore(commit_name,data) {
  try {
    storeCommit(commit_name, data);
  } catch (error) {
    console.error('Error commit:', error);
  }
}
function task_loop(){
  get_task_list_loop()
}

// 每隔一段时间执行一次轮询
let task_loop_interval = null
function start_task_loop(){
  if(task_loop_interval == null){
    console.log('start_task_loop!')
    task_loop_interval = setInterval(task_loop, 3000); // 每3秒执行一次
  }
}
start_task_loop()

function get_task_list_loop(){
    return request_get('task/get_all_task',{},(data)=>{ 
      // console.log('get task data finish:')
      // console.log(data)
      if(data['status'] == 'success'){
          let task_list = data['data']
          let attack_task_list = []
          let defend_task_list = []
          let updated = false 
          for(let i =0;i<task_list.length;i++){
            let task = task_list[i]
            task = proccess_update_task(task)
            if(task['player'] == 'attacker'){
              attack_task_list.push(task)
              if(task['task_name'] == "host_scan"){
                updated = update_task(task,'attacker','attackerPortScan')
              }
              if(task['task_name'] == "host_attack"){
                updated = update_task(task,'attacker','attackerDDoSAttack')
              }
              
            }
            if(task['player']== 'defender'){
              defend_task_list.push(task)
              if(task['task_name']=="host_deception"){
                updated = update_task(task,'defender','defenderHostDeception')
              }
              if(task['task_name']=="host_protocol_forbid"){
                updated = update_task(task,'defender','defenderDefendTask')
              }
            }
            
          }
          if(updated){
            updateStore('updateAttackerHistoryOperation',attack_task_list)
            updateStore('updateDefenderHistoryOperation',defend_task_list)
          }
          
      }else{
        console.log(data['message'])
      }
    }, (error)=>{ 
      console.log(error)
    })
}
function updateTaskHistoryData(task){
  let taskHistoryDatalist = store.getters.getTaskHistoryData
  let taskHistoryDataItem = [
    task['player']=='attacker'?'攻击者':'防御者',
    task['timestamp'],
    task['title'],
    task['client_ip'],
    task['params']['duration']==undefined?0:task['params']['duration'],
  ]
  taskHistoryDatalist.push(taskHistoryDataItem)
  console.log('task',task)
  console.log('updateTaskHistoryDatalist finish:',taskHistoryDatalist)
  updateStore('updateTaskHistoryData',taskHistoryDatalist)
}
function updateOperationRankData(task){
  let operation_rank_data = store.getters.getOperationRankData
  if(operation_rank_data[task['task_name']]!=undefined){
    operation_rank_data[task['task_name']]['value']+=1
  }
  else{
    operation_rank_data[task['task_name']]['name']=task['task_name']
    operation_rank_data[task['task_name']]['value']=1
  }
  console.log('updateOperationRankData finish:',operation_rank_data)
  updateStore('updateOperationRankData',operation_rank_data)
}
function update_task(task,player,task_env_name){
  let envStatusSummary = (player=='attacker'?
    deepCopy(store.getters.getAttackerEnvStatusSummary[task_env_name]):
    deepCopy(store.getters.getDefenderEnvStatusSummary[task_env_name]))
  let summaryStatisticParams=envStatusSummary['statisticParams'];
  let taskEnvStatus = (player=='attacker'?
    deepCopy(store.getters.getAttackerEnvStatus[task_env_name]):
    deepCopy(store.getters.getDefenderEnvStatus[task_env_name]))
  let envStatusResultDataList = taskEnvStatus['envStatusResultDataList']
  let task_id = task['task_id']
  let task_status = task['status']
  let task_result = task['result']
  let task_env_title_map = {
    'attackerPortScan':'端口扫描',
    'attackerDDoSAttack':'DDoS攻击',
    'defenderHostDeception':'端口伪装',
    'defenderDefendTask':'防御任务'
  }
  let envStatusResultDataItem = {
    task_id:task_id,
    title:task_env_title_map[task_env_name]!=undefined?task_env_title_map[task_env_name]:'未知任务',
    statusTitle:task_status=='running'?'执行中':'执行完成',
    status:task_status
  }
  
  let isNewTask = true
  let isUpdateTask = false
  let isFinishTask = false
  let currentTaskIndex = -1
  for(let i=0;i<envStatusResultDataList.length;i++){
    if(envStatusResultDataList[i]['task_id']==task_id){
      currentTaskIndex = i
      if(envStatusResultDataList[i]['status']!=task_status){
        envStatusResultDataList[i]['status'] = task_status
        console.log('update task:'+task_status)
        isUpdateTask = true
        if(task_status=='success'||task_status=='error'){
          isFinishTask = true
        }
      }
      isNewTask = false
      break
    }
  }
  if(!isNewTask&&!isUpdateTask){
    //没有任何更新则直接返回
    return false
  }
  
  if(isNewTask){
    envStatusResultDataList.push(envStatusResultDataItem)
    currentTaskIndex = envStatusResultDataList.length - 1
    //新任务
    summaryStatisticParams[0]['value']+=1
    if(task_status=='success'||task_status=='error'){
      //任务已经完成
      isFinishTask = true
      summaryStatisticParams[2]['value']+=1
    }
    //更新任务面板
    updateTaskHistoryData(task)
    //更新任务排行(有新任务)
    updateOperationRankData(task)
  }
  if(isUpdateTask){
    //更新任务
    if(task_status=='success'||task_status=='error'){
      //任务已经完成
      isFinishTask = true
      if(isFinishTask&&summaryStatisticParams[1]['value']>0)
        summaryStatisticParams[1]['value']-=1
      summaryStatisticParams[2]['value']+=1
    } 
  }
  if(isFinishTask){
    //任务完成更新任务结果
    if(task_env_name == 'attackerPortScan')
      envStatusResultDataItem = proccess_host_scan_task_result(task,task_result,envStatusResultDataItem)
    if(task_env_name == 'attackerDDoSAttack')
      envStatusResultDataItem = proccess_host_attack_task_result(task,task_result,envStatusResultDataItem)
    if(task_env_name == 'defenderHostDeception')
      envStatusResultDataItem = proccess_host_deception_task_result(task,task_result,envStatusResultDataItem)
    if(task_env_name == 'defenderDefendTask')
      envStatusResultDataItem = proccess_defender_defend_task_result(task,task_result,envStatusResultDataItem)

    envStatusResultDataList[currentTaskIndex] = envStatusResultDataItem
  }

  if(isNewTask||isUpdateTask){
    //更新数据
    updateStore(
      (player == 'attacker'?
        'updateAttackerEnvironmentStatusDataMapByName':
        'updateDefenderEnvironmentStatusDataMapByName'),
      {'name':task_env_name,'data':envStatusResultDataList}
    )
    
    //更新摘要信息
    envStatusSummary['statisticParams'] = summaryStatisticParams
    updateStore(
      (player == 'attacker'?
      'updateAttackerEnvironmentStatusSummaryMapByName':
      'updateDefenderEnvironmentStatusSummaryMapByName'),
      {'name':task_env_name,'data':envStatusSummary}
    )
    return true
  }
  return false
  
}

function proccess_update_task(task){
  if(task['timestamp']!=null){
    task['timestamp'] = formatTimestamp(task['timestamp']) //转换时间戳
  }
  return task
}

/*攻击者任务结果处理*/
function proccess_host_scan_task_result(task,task_result,envStatusResultDataItem){
    //更新任务结果
  if(task_result!=undefined){
    for(let j=0;j<task_result.length;j++){
      let scan_result = task_result[j]
      let port = scan_result['port']
      let response_time  = scan_result['response_time']
      envStatusResultDataItem['port']=port
      envStatusResultDataItem['response_time']=response_time
    }
    envStatusResultDataItem['target_ip']=task['params']['target_ip']
  }
  return envStatusResultDataItem
}
function proccess_host_attack_task_result(task,task_result,envStatusResultDataItem){
  if(task_result!=undefined){
      for(let j=0;j<task_result.length;j++){
        let result = task_result[j]
        envStatusResultDataItem['attack_type']=task['params']['attack_type']
        envStatusResultDataItem['attack_duration']=task['params']['attack_duration']
      }
      envStatusResultDataItem['target_ip']=task['params']['target_ip']
  }
  return envStatusResultDataItem
}

/*防御者任务结果处理*/
function proccess_host_deception_task_result(task,task_result,envStatusResultDataItem){
  //更新任务结果
  if(task_result!=undefined){
    let deception_result = task
    let port = deception_result['port']
    let request_delay_min  = deception_result['request_delay_min']
    let request_delay_max  = deception_result['request_delay_max']
    envStatusResultDataItem['port']=port
    envStatusResultDataItem['request_delay_min']=request_delay_min
    envStatusResultDataItem['request_delay_max']=request_delay_max
    envStatusResultDataItem['client_ip']=task['client_ip']
  }
  return envStatusResultDataItem
}

function proccess_defender_defend_task_result(task,task_result,envStatusResultDataItem){
  //更新任务结果
  if(task_result!=undefined){
    let deception_result = task
    envStatusResultDataItem['client_ip']=(task['client_ip']==''?task['swicth_dpid']:task['client_ip'])
  }
  return envStatusResultDataItem
}

export {
    task_loop
}