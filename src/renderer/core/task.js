// task.js
import store from '@/store';
import {request_get,request_post} from '@/util/request';
import { deepCopy,formatTimestamp } from '@/util';
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
    request_post('task/send_player_task_list',task_list,(data)=>{ 
        //返回任务ID更新 
        console.log("send_player_task_list success!")
        console.log(data)
        if(data['status'] == 'success'){
            let task_list = data['data']
            let history_operation_link_list = store.getters.getAttackerHistoryOperation
            history_operation_link_list = history_operation_link_list.concat(task_list)
            updateStore('updateAttackerHistoryOperation',history_operation_link_list)
            store.commit('showInfoMessage',{'message':'服务端任务接收成功','type':'success'})
        }else{
          store.commit('showInfoMessage',{'message':data['message']})
        }
    }, (error)=>{ 
      store.commit('showInfoMessage',{'message':error,'type':'error'})
    })
}

function send_defender_task_list(task_list){
  //发送任务队列请求
  request_post('task/send_player_task_list',task_list,(data)=>{ 
      //返回任务ID更新 
      console.log("send_player_task_list success!")
      console.log(data)
      if(data['status'] == 'success'){
          let task_list = data['data']
          let history_operation_link_list = store.getters.getDefenderHistoryOperation
          history_operation_link_list = history_operation_link_list.concat(task_list)
          updateStore('updateDefenderHistoryOperation',history_operation_link_list)
          store.commit('showInfoMessage',{'message':'服务端任务接收成功','type':'success'})
      }else{
        store.commit('showInfoMessage',{'message':data['message']})
      }
  }, (error)=>{ 
    store.commit('showInfoMessage',{'message':error,'type':'error'})
  })
}
function get_task_result_by_task_id(task_id){
  request_get('task/get_task_result_by_task_id',{'task_id':task_id},(data)=>{
    if(data['status'] == 'success'){

    }else{
      console.log(data['message'])
    }
  },(error)=>{ 
    console.log(error)
  })
}
function proccess_operation_link_to_task(player,operation_task_list){
    let task_list = []
    for(let i = 0;i<operation_task_list.length;i++){
        let labels = {}
        let params = {}
        for(let j = 0;j<operation_task_list[i].params.length;j++){
            params[operation_task_list[i].params[j].name] = operation_task_list[i].params[j].value
            labels[operation_task_list[i].params[j].name] = operation_task_list[i].params[j].title
        }
        let task_title = operation_task_list[i]['title']
        let client_type = operation_task_list[i]['clientType']
        let client_ip = params['client_ip']==undefined?'':params['client_ip']
        let target_ip = params['target_ip']==undefined?'':params['target_ip']
        let swicth_dpid = params['dpid']==undefined?'':params['dpid']
        let task = {
            'player':player,
            'client_type':client_type,
            'client_ip':client_ip,
            'target_ip':target_ip,
            'swicth_dpid':swicth_dpid,
            'title':task_title,
            'task_type':operation_task_list[i].operationType,
            'task_name':operation_task_list[i].name,
            'status':'running',
            'params':params,
            'result':[],
            'timestamp':formatTimestamp(Date.now())
        }
        task_list.push(task)
    }
    console.log("send task list:")
    console.log(task_list)
    if(player == 'attacker'){
        send_attacker_task_list(task_list)
    }
    if(player == 'defender'){
        send_defender_task_list(task_list)
    }
    
}


export {
    send_defender_task_list,
    send_attacker_task_list,
    get_task_result_by_task_id,
    proccess_operation_link_to_task
}