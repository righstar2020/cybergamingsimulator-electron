import store from '../store';
import {storeCommit} from '../store/send_store.js';
import {request_get,request_post} from '../util/request.js';
import { deepCopy,formatTimestamp2 } from '../util';

//监控网络仿真环境状态数据
//总状态数值面板、网络状态动态地图
//流量熵、特定agent(SDN交换机)流量峰值、协议比例
//任务流数据、CPU内存使用率、操作执行数排行

function updateStore(commit_name,data) {
    try {
      storeCommit(commit_name, data);
    } catch (error) {
      console.error('Error commit:', error);
    }
}

function get_env_network_loop(){
    //获取动态网络拓扑信息
    request_get('network/get_network_dynamic_topo_data',{},(data)=>{
      // console.log('get_topo_data finish:')
      // console.log(data)
      if(data['status'] == 'success'){
        updateStore('updateNetworkDynamicMapData',data['data'])
      }else{
        console.log(data['message'])
      }
    }, (error)=>{ 
  
    })
  }
  function get_env_status_loop(){
      //获取流量熵指标
      request_get('env/get_traffic_entropy',{},(data)=>{
        // console.log('get_traffic_entropy finish:')
        // console.log(data)
        if(data['status'] == 'success'){
            let source_ips_entropy = data['data']['source_ips_entropy']
            let destination_ports_entropy = data['data']['destination_ports_entropy']
            if(source_ips_entropy.length == 0 && destination_ports_entropy.length == 0)
                return
            let trafficEntropyData = deepCopy(store.getters.getEnvironmentMonitorData['trafficEntropyData'])
            trafficEntropyData['source_ips_entropy'] = trafficEntropyData['source_ips_entropy'].concat(source_ips_entropy)
            trafficEntropyData['destination_ports_entropy'] = trafficEntropyData['destination_ports_entropy'].concat(destination_ports_entropy)
            trafficEntropyData['timestamp'].push(formatTimestamp2(Date.now()))
            //取后120个数据
            trafficEntropyData['source_ips_entropy'] = trafficEntropyData['source_ips_entropy'].toReversed().splice(0,120).toReversed()
            trafficEntropyData['destination_ports_entropy'] = trafficEntropyData['destination_ports_entropy'].toReversed().splice(0,120).toReversed()
            //对齐长度
            trafficEntropyData['timestamp'] = trafficEntropyData['timestamp'].toReversed().splice(0,trafficEntropyData['source_ips_entropy'].length).toReversed()
            // console.log("trafficEntropyData:",trafficEntropyData)
            updateStore('updateTrafficEntropyData',trafficEntropyData)           
        }else{
          console.log(data['message'])
        }
      }, (error)=>{ 
    
      })
      //获取流量指标数据
      request_get('env/get_traffic_flow',{},(data)=>{
        // console.log('get_traffic_flow finish:')
        // console.log(data)
        if(data['status'] == 'success'){
            let flow_data_list = data['data']
            let total_flow_bytes = 0
            for(let i =0;i<flow_data_list.length;i++){
                total_flow_bytes += flow_data_list[i]['value']
            }
            let trafficFlowData = store.getters.getEnvironmentMonitorData['trafficFlowData']
            let traffic_flow_data = {
                'timestamp_list':trafficFlowData['timestamp_list'],
                'total_flow_bytes':trafficFlowData['total_flow_bytes']
            }
            traffic_flow_data['timestamp_list'].push(formatTimestamp2(Date.now()))
            traffic_flow_data['total_flow_bytes'].push(total_flow_bytes)
            //取后500个数据
            traffic_flow_data['timestamp_list'] = traffic_flow_data['timestamp_list'].toReversed().splice(0,120).toReversed()
            traffic_flow_data['total_flow_bytes'] = traffic_flow_data['total_flow_bytes'].toReversed().splice(0,120).toReversed()
            updateStore('updateTrafficFlowData',traffic_flow_data)
        }else{
          console.log(data['message'])
        }
      }, (error)=>{ 
    
      })
      //获取CPU内存数据
      request_get('env/get_cpu_memory_usage_status',{},(data)=>{
        // console.log('get_cpu_memory_usage_status finish:')
        // console.log(data)
        if(data['status'] == 'success'){
          
          let env_data = data['data']
          updateStore('updateEnvStatusDataByKey',{'key':'cpu_percent','data':env_data['cpu_percent']})
          updateStore('updateEnvStatusDataByKey',{'key':'memory_percent','data':env_data['memory_percent']})
        }else{
  
        }
      }, (error)=>{ 
    
      })
      //获取协议统计数量
      request_get('env/get_protocol_count',{},(data)=>{
        // console.log('get_protocol_count finish:')
        // console.log(data)
        if(data['status'] == 'success'){
            let env_data = data['data']
            updateStore('updateEnvStatusDataByKey',{'key':'protocol_data','data':env_data})
        }else{

        }
      }, (error)=>{ 
    
      })
  }
function env_monitor_loop(){
    //更新当前网络拓扑状态
    get_env_network_loop()
    //轮询环境状态
    get_env_status_loop()
}
  
//每隔一段时间执行一次轮询
let env_monitor_loop_interval = null
function start_env_monitor_loop(){
    if(env_monitor_loop_interval == null){
        console.log('start_env_monitor_loop!')
        env_monitor_loop_interval = setInterval(env_monitor_loop, 1000); // 每1秒执行一次
    }
}
start_env_monitor_loop()
export{
    start_env_monitor_loop
}