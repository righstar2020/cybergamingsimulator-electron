import store from '@/store';
import {request_get,request_post} from '@/util/request';
import { deepCopy,formatTimestamp2 } from '@/util';

//监控网络仿真环境状态数据
//总状态数值面板、网络状态动态地图
//流量熵、特定agent(SDN交换机)流量峰值、协议比例
//任务流数据、CPU内存使用率、操作执行数排行
const hostImage = require("@/assets/host.png");
const serverImage = require("@/assets/host.png");
const serverAttackerImage = require("@/assets/server_attacker.png");
const serverDefendImage = require("@/assets/server_defend.png");
const serverAttackedImage = require("@/assets/server_attacked.png");
const switchImage = require("@/assets/switch.png");
const switchDefendImage = require("@/assets/switch_defend.png");
let environmentMonitorData = {
    headerDigitalData:{},
    trafficFlowData:{},
    networkDynamicMapData:{

    },
    taskRealTimeData:{},
    operationRankData:{},
    trafficEntropyData:{},
    protocolRateRankData:{},
    envData:{
        cpu_rate:0.0,
        memory_rate:0.0
    }
}

let mockNetworkDynamicMapData = {
    "topo_id": "topo_1",
    'links':[{
        "id": "link_1",
        "label": "link 1",
        "from": "host_1",
        "to": "switch_1",
        "link_type": "normal",
        "link_status": "up",
        "link_bandwidth": 1000,
        "link_delay": 0,
        "link_loss": 0
     }],
    'nodes':{
        "host_1":{
            'id': 'host_1',
            'label': "Host 1",
            "node_type": "host",
            'image': hostImage,
            'image_blink':hostImage,
            'shape': "image",
            "node_status": "up",
            "ip": "10.0.0.1",
            "mac": "00:00:00:00:00:01"
        },
        "switch_1":{
            'id': 'switch_1',
            'label': "Switch 1",
            "node_type": "switch",
            'image': switchImage,
            'shape': "image",
            "node_status": "up",
            "ip": "10.0.0.1",
            "mac": "00:00:00:00:00:01"
        }
    },
    'config_info':{},
    'timestamp':1718281503618   
}
function updateStore(commit_name,data) {
    try {
      store.commit(commit_name, data);
    } catch (error) {
      console.error('Error commit:', error);
    }
}
function genMockNetworkDynamicMapData() {
    let networkDynamicMapData =  mockNetworkDynamicMapData
    let nodes = []
    let links = []
    
    for(let i=0;i<6;i++){
        let switch_name = 'switch_'+i
        nodes[switch_name]={
            'id': switch_name,
            'label': "Switch "+i,
            "node_type": "switch",
            'image': switchImage,
            'shape': "image",
            "node_status": "up",
            "ip": "10.0."+i+".0"
        }
        for(let j=1;j<3;j++){
            let node_name = 'host_'+i+'_'+j
            nodes[node_name]={
                'id': node_name,
                'label': "Host "+i+'_'+j,
                "node_type": "host",
                'image': serverImage,
                'shape': "image",
                "node_status": "up",
                "ip": "10.0."+i+"."+j
            }
            links.push({
                from:switch_name,
                to:node_name
            })
        }
        if(i!=5){
            links.push({
                from:switch_name,
                to:'switch_'+(i+1)
            })
        }
            
    }
    networkDynamicMapData['nodes'] = nodes
    networkDynamicMapData['links'] = links
    networkDynamicMapData['timestamp'] = Date.now()
    return networkDynamicMapData
}
function getNetworkDynamicMapData(){
    let dynamicNetworkTopoData = store.getters.getNetworkDynamicMapData
    let networkTopoData = proccessNetworkDynamicMapData(dynamicNetworkTopoData)
    if(networkTopoData == {}||networkTopoData['nodes'] == undefined || networkTopoData['links'] == undefined){
        networkTopoData = genMockNetworkDynamicMapData()
        return networkTopoData
    }
    return networkTopoData
} 
function proccessNetworkDynamicMapData(networkDynamicMapData){
    if(networkDynamicMapData['topo_data']==undefined){
        return {}
    }
    let newNetworkDynamicMapData = networkDynamicMapData['topo_data']  
    let nodes = Object.values(newNetworkDynamicMapData['nodes'])
    let links = newNetworkDynamicMapData['links']
    
    for(let i=0;i<nodes.length;i++){
        nodes[i]['shape'] = "image"
        if(nodes[i]['node_type']=='host'){
            nodes[i]['image'] = serverImage
            if(nodes[i]['defend_source']!=undefined&&nodes[i]['defend_source']!=''){
                nodes[i]['image'] = serverDefendImage
                console.log("new node image",nodes[i])
            }
            if(nodes[i]['attack_source']!=undefined&&nodes[i]['attack_source']!=''){
                nodes[i]['image'] = serverAttackerImage
                console.log("new node image",nodes[i])
            }
            if(nodes[i]['victim_source']!=undefined&&nodes[i]['victim_source']!=''){
                nodes[i]['image'] = serverAttackedImage
                console.log("new node image",nodes[i])
            }
        }
        if(nodes[i]['node_type']=='swicth'){
            nodes[i]['image'] = switchImage
            if(nodes[i]['defend_source']!=undefined&&nodes[i]['defend_source']!=''){
                nodes[i]['image'] = switchDefendImage
                console.log("new node image",nodes[i])
            }
        }
            
    }
    newNetworkDynamicMapData['nodes'] = nodes
    newNetworkDynamicMapData['links'] = links
    newNetworkDynamicMapData['timestamp'] = Date.now()
    return newNetworkDynamicMapData
}

  

export{
    getNetworkDynamicMapData,
    proccessNetworkDynamicMapData
}