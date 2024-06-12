// task.js
import store from '@/store';
import {request_get,request_post} from '@/util/request';
import { deepCopy } from '@/util';
function updateStore(commit_name,data) {
  try {
    store.commit(commit_name, data);
    console.log(store)
  } catch (error) {
    console.error('Error commit:', error);
  }
}


function send_attacker_task_list(task_list){
    //发送任务队列请求
    request_post('send_player_task_list',task_list,(data)=>{ 
        //返回任务ID更新 
        console.log("send_player_task_list success!")
        console.log(data)
        if(data['status'] == 'success'){
            
            let task_id_list = data['data']
            let history_operation_link_list = store.getters.getAttackerHistoryOperation
            
            for(let k = 0;k<task_list.length;k++){
              let history_operation_list = history_operation_link_list[k]
              for(let i = 0;i<history_operation_list.length;i++){
                for(let j = 0;j<task_list.length;j++)
                  if(history_operation_list[i]['id'] ==  task_id_list[j]['id']){
                    history_operation_list[i]['task_id'] ==  task_id_list[j]['task_id']
                    history_operation_link_list[k]= history_operation_list
                  }
              }
            }
            updateStore('updateAttackerHistoryOperation',history_operation_link_list)
            store.commit('showInfoMessage',{'message':'服务端任务接收成功'})
            console.log(data)
        }else{
          store.commit('showInfoMessage',{'message':data['message']})
        }
    }, (error)=>{ 
      console.log(error)
      store.commit('showInfoMessage',{'message':error})
    })
}

function send_defender_task_list(task_list){
  //发送任务队列请求
  request_post('send_player_task_list',task_list,(data)=>{ 
      //返回任务ID更新 
      console.log("send_player_task_list success!")
      console.log(data)
      if(data['status'] == 'success'){
          console.log("send_player_task_list success!"+data)
          let task_id_list = data['data']
          let history_operation_link_list = store.getters.getDefenderHistoryOperation
          for(let k = 0;k<task_list.length;k++){
            let history_operation_list = history_operation_link_list[k]
            for(let i = 0;i<history_operation_list.length;i++){
              for(let j = 0;j<task_list.length;j++)
                if(history_operation_list[i]['id'] ==  task_id_list[j]['id']){
                  history_operation_list[i]['task_id'] ==  task_id_list[j]['task_id']
                  history_operation_link_list[k]= history_operation_list
                }
            }
          }
          updateStore('updateDefenderHistoryOperation',history_operation_link_list)
          store.commit('showInfoMessage',{'message':'服务端任务接收成功'})
          console.log(data)
      }else{
        console.log(data['message'])
        store.commit('showInfoMessage',{'message':data['message']})
      }
  }, (error)=>{ 
      console.log(error)
      store.commit('showInfoMessage',{'message':error})
  })
}
function get_task_result_by_task_id(task_id){
  request_get('get_task_result_by_task_id',{'task_id':task_id},(data)=>{
    if(data['status'] == 'success'){

    }else{
      console.log(data['message'])
    }
  },(error)=>{ 
    console.log(error)
  })
}

function get_env_status_loop(){
    //获取流量熵指标
    request_get('get_traffic_entropy',{},(data)=>{
      console.log('get_traffic_entropy finish:')
      console.log(data)
      if(data['status'] == 'success'){
        
      }else{
        console.log(data['message'])
      }
    }, (error)=>{ 
  
    })
    //获取流量指标数据
    request_get('get_traffic_flow',{},(data)=>{
      console.log('get_traffic_flow finish:')
      console.log(data)
      if(data['status'] == 'success'){
        
      }else{
        console.log(data['message'])
      }
    }, (error)=>{ 
  
    })
}
function task_loop(){
  //轮询任务列表并更新任务状态
  get_task_result_loop()
  //轮询环境状态
  get_env_status_loop()
}

// 每隔一段时间执行一次轮询
const task_loop_interval = setInterval(task_loop, 10000); // 每10秒执行一次

// 如果需要在某个时刻停止轮询，可以暴露一个函数来清除定时器
function stop_task_loop() {
  clearInterval(task_loop_interval);
}

function get_task_result_loop(){
    //更新攻击任务状态
  
    get_and_update_attacker_env_status()
    //更新防御任务状态

  }

function get_and_update_attacker_env_status(){
    return request_get('get_attacker_task',{},(data)=>{ 
      console.log('get attacker task result finish:')
      console.log(data)
      if(data['status'] == 'success'){
          let attacker_task_list = data['data']
          for(let i =0;i<attacker_task_list.length;i++){
            let task = attacker_task_list[i]
            if(task['player'] == 'attacker'){
              if(task['task_name'] == "host_scan"){
                update_attacker_port_scan_env_status(task)
              }
            }
            if(task['player']== 'defender'){
              if(task['task_name']=="host_deception"){
              }
            }
            
          }
      }else{
        console.log(data['message'])
      }
    }, (error)=>{ 
      console.log(error)
    })
}

function update_attacker_port_scan_env_status(task){
    console.log('update port scan task:')
    console.log(task)
    task = deepCopy(task)
    let attackerEnvStatusSummary = deepCopy(store.getters.getAttackerEnvStatusSummary['attackerPortScan'])
    let summaryStatisticParams=attackerEnvStatusSummary['statisticParams'];
    let attackerEnvStatus = deepCopy(store.getters.getAttackerEnvStatus['attackerPortScan'])
    let envStatusResultDataList = attackerEnvStatus['envStatusResultDataList']
    let task_id = task['task_id']
    let task_status = task['status']
    let task_result = task['result']
    let envStatusResultDataItem = {
        id:task['id'],
        operation_link_id:task['operation_link_id'],
        task_id:task_id,
        title:'端口扫描',
        statusTitle:task['status']=='running'?'扫描中':'扫描完成',
        status:task['status'],
        target_ip:task['params']['target_ip'],
        port:'',
        response_time:''
    }
    if(task_result!=undefined){
        for(let j=0;j<task_result.length;j++){
          let scan_result = task_result[j]
          let port = scan_result['port']
          let response_time  = scan_result['response_time']
          envStatusResultDataItem['port']=port
          envStatusResultDataItem['response_time']=response_time
        }
    }
    
    let isNewTask = true
    let isUpdateTask = false
    let isTaskFinished = false
    for(let i =0;i<envStatusResultDataList.length;i++){
        console.log('task id compare:'+task_id+"-->"+envStatusResultDataList[i]['task_id'])
        if(task_id == envStatusResultDataList[i]['task_id']){
            if(task_status != envStatusResultDataList[i]['status']){
              envStatusResultDataList[i] = envStatusResultDataItem
              console.log('update port_scan task result:')
              console.log(envStatusResultDataItem)
              isNewTask = false
              isUpdateTask = true
              isTaskFinished = true
              break
            }
            isNewTask = false 
            break      
        }
    }
    //新任务进队
    if(isNewTask){
      console.log('new port scan task result:')
      console.log(envStatusResultDataItem)
      envStatusResultDataList.push(envStatusResultDataItem)
      if(task['status']=='success'){
        isTaskFinished = true
      }
    }
    //更新数据
    updateStore(
      'updateAttackerEnvironmentStatusDataMapByName',
      {'name':'attackerPortScan','data':envStatusResultDataList}
    )
    //更新摘要信息
    for(let i =0;i<summaryStatisticParams.length;i++){
      let value = deepCopy(summaryStatisticParams[i]['value'])
      if(summaryStatisticParams[i]['name']=='total_task_num'&&isNewTask){      
        summaryStatisticParams[i]['value'] =value +1  
      }
      if(summaryStatisticParams[i]['name']=='running_task_num'&&isUpdateTask&&isTaskFinished){
          value = value - 1
          if(value<0) {value = 0;}
          summaryStatisticParams[i]['value'] = value
      }else{
        if(isNewTask){
          summaryStatisticParams[i]['value'] = value +1  
        }
      }
      //扫描结果
      if(summaryStatisticParams[i]['name']=='scan_result_num'&&isUpdateTask&&isTaskFinished){
        summaryStatisticParams[i]['value'] = 0
      }
    }
    attackerEnvStatusSummary['statisticParams'] = summaryStatisticParams
    updateStore(
      'updateAttackerEnvironmentStatusSummaryMapByName',
      {'name':'attackerPortScan','data':attackerEnvStatusSummary}
    )
}



export {
    task_loop,
    stop_task_loop,
    send_defender_task_list,
    send_attacker_task_list,
    get_task_result_by_task_id
}