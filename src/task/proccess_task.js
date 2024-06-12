import {send_defender_task_list,send_attacker_task_list} from './task.js'
import store from '@/store';
function proccess_operation_link_to_task(player,operationLinkId,operation_link){
    let task_list = []
    for(let i = 0;i<operation_link.length;i++){
        let params = {}
        for(let j = 0;j<operation_link[i].params.length;j++){
            params[operation_link[i].params[j].name] = operation_link[i].params[j].value
        }
        let client_ip = params['client_ip'] 
        let task = {
            'id':operation_link[i].id,
            'operation_link_id':operationLinkId,
            'player':player,
            'client_ip':client_ip,
            'task_type':operation_link[i].operationType,
            'task_name':operation_link[i].name,
            'status':'running',
            'params':params,
            'result':[]
        }
        task_list.push(task)
    }
    console.log("send task list:")
    console.log(task_list)
    store.commit('showInfoMessage',{'message':'任务下发成功'})
    if(player == 'attacker'){
        send_attacker_task_list(task_list)
    }
    if(player == 'defender'){
        send_defender_task_list(task_list)
    }
    
}

export {
    proccess_operation_link_to_task
}