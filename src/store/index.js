// store/index.js
import { createStore } from 'vuex'
import defaultEchartOption from './echart.js' 
const store = createStore({
  state: {
    global:{
        currentCopyFormData:{},
        message:{
            message:''
        },
        defaultEchartOption:defaultEchartOption
    },
    attacker:{
        baseOperation:{
            signal:[{
                title:'主机扫描',
                name:'host_scan',
                operationType:'signal',
                description:'对特定主机进行扫描.\n参数:ip->目标主机IP \n返回结果:主机端口状态',
                params:[{
                    title:'执行主机IP',
                    name:'client_ip',
                    formType:'input',
                    type:'text'
                },{
                    title:'目标主机IP',
                    name:'target_ip',
                    formType:'input',
                    type:'text'
                }]
            },
            {
                title:'链路测绘',
                name:'link_scope',
                operationType:'signal',
                description:'对特定链路进行测绘.\n 参数:ip_source->链路起始主机IP,ip_destination->链路终点主机IP \n返回结果:链路状态(延迟等)',
                params:[{
                    title:'起始节点IP',
                    name:'ip_source',
                    formType:'input',
                    type:'text'
                },{
                    title:'终止节点IP',
                    name:'ip_destination',
                    formType:'input',
                    type:'text'
                }]
            }],
            action:[{
                title:'攻击目标主机',
                name:'host_attack',
                operationType:'action',
                description:'对特定主机进行DDoS攻击.\n 参数:ip->目标主机IP \n返回结果:网络拥堵状态',
                params:[{
                    title:'目标主机IP',
                    name:'targetIp',
                    formType:'input',
                    type:'text'
                }]
              },
              {
                title:'攻击目标链路',
                name:'link_attack',
                operationType:'action',
                description:'对特定链路进行攻击.\n 参数:ip_source->链路起始主机IP,ip_destination->链路终点主机IP \n返回结果:链路状态(延迟等)',
                params:[{
                    title:'起始节点IP',
                    name:'ip_source',
                    formType:'input',
                    type:'text'
                },{
                    title:'终止节点IP',
                    name:'ip_destination',
                    formType:'input',
                    type:'text'
                }]
            }]
        },
        selectedOperation:[],
        runningOperation:[],
        historyOperation:[],
        environmentStatusSummaryMap:{
            "attackerPortScan":{
                title:'端口扫描任务',
                name:'attackerPortScan',
                statisticParams:[{
                  title:'总任务数',
                  name:'total_task_num',
                  value:0
                },{
                  title:'正在执行',
                  name:'running_task_num',
                  value:0
                },{
                  title:'扫描结果',
                  name:'scan_result_num',
                  value:0
                }]
            }
        },
        environmentStatusMap:{
            "attackerPortScan":{
                title:'端口扫描结果',
                envStatusResultLabelList:[{
                  name:'target_ip',
                  title:'目标IP'
                },{
                  name:'port',
                  title:'存活端口'
                },{
                  name:'response_time',
                  title:'端口延迟'
                }],
                envStatusResultDataList:[]
              }
        },
        config:{}
    },
    defender:{
        baseOperation:{
            signal:[{
                title:'主机伪装',
                name:'host_deception',
                operationType:'signal',
                description:'通过设置延迟把主机伪装成蜜罐.\n延迟单位s\n返回结果:主机状态',
                params:[{
                    title:'执行主机IP',
                    name:'client_ip',
                    formType:'input',
                    type:'text'
                },{
                    title:'伪装端口',
                    name:'port',
                    formType:'input',
                    type:'number'
                },{
                    title:'请求延迟min',
                    name:'request_delay_min',
                    formType:'input',
                    type:'text'
                },
                {
                    title:'请求延迟max',
                    name:'request_delay_max',
                    formType:'input',
                    type:'text'
                }
            ]
            },
            {
                title:'traceroute欺骗',
                name:'link_scope_deception',
                operationType:'signal',
                description:'指示特定链路不支持traceroute规则,TTL随机衰减,达到混淆效果.\n 参数:ip_source->链路起始主机IP,ip_destination->链路终点主机IP \n返回结果:链路状态(延迟等)',
                params:[{
                    title:'起始节点IP',
                    name:'ip_source',
                    formType:'input',
                    type:'text'
                },{
                    title:'终止节点IP',
                    name:'ip_destination',
                    formType:'input',
                    type:'text'
                }]
            }],
            action:[{
                title:'流量过滤',
                name:'host_traffic_filter',
                operationType:'action',
                description:'在特定交换机上部署流量过滤器.\n 参数:dpid->SDN交换机ID \n返回结果:主机状态',
                params:[{
                    title:'节点IP',
                    name:'targetIp',
                    formType:'input',
                    type:'text'
                }]
              },
              {
                title:'白名单',
                name:'host_white_table',
                operationType:'action',
                description:'在特定主机或交换机上使用白名单进行流量过滤.\n 参数:ip->目标主机IP \n返回结果:主机状态',
                params:[{
                    title:'节点IP',
                    name:'targetIp',
                    formType:'input',
                    type:'text'
                }]
              },
              {
                title:'协议封禁',
                name:'host_protocol_forbid',
                operationType:'action',
                description:'在特定主机或交换机上进行特定协议封禁.\n 参数:ip->目标主机IP,protocol->协议类型(icmp/udp) \n返回结果:主机状态',
                params:[{
                    title:'节点IP',
                    name:'targetIp',
                    formType:'input',
                    type:'text'
                },
                {
                    title:'协议名称',
                    name:'protocol',
                    formType:'input',
                    type:'text'
                }
                ]
              }
            ]
        },
        selectedOperation:[],
        runningOperation:[],
        historyOperation:[],
        environmentStatusSummaryMap:{},
        environmentStatusMap:{},
        config:{}
    },
    network:{},
    gamingStatus:{
        totalStepNum:0,
        currentGameRound:0,
        currentPlayer:'attacker',
        attackerOperationNum:0,
        defenderOperationNum:0
    },
    environmentMonitor:{
        headerDigitalData:{},
        trafficFlowData:{},
        networkDynamicMapData:{},
        taskRealTimeData:{},
        operationRankData:{},
        trafficEntropyData:{},
        protocolRateRankData:{},
        envData:{
            cpu_rate:0.0,
            memory_rate:0.0
        }
    }
  },
  getters: {
    getEnvironmentMonitorData(state){
        return state.environmentMonitor
    },
    getAttackerBaseOperation(state){
        return state.attacker.baseOperation
    },
    getDefenderBaseOperation(state){
        return state.defender.baseOperation
    },
    getCurrentCopyFormData(state){
        return state.global.currentCopyFormData
    },
    getAttackerHistoryOperation(state){
        return state.attacker.historyOperation
    },
    getDefenderHistoryOperation(state){
        return state.defender.historyOperation
    },
    getDefaultEchartOption(state){
        return state.global.defaultEchartOption
    },
    getAttackerEnvStatusSummary(state){
        return state.attacker.environmentStatusSummaryMap
    },
    getAttackerEnvStatus(state){
        return state.attacker.environmentStatusMap
    },
    getDefenderEnvStatusSummary(state){
        return state.defender.environmentStatusSummaryMap
    },
    getDefenderEnvStatus(state){
        return state.defender.environmentStatusMap
    }
  },
  mutations: {
    showInfoMessage(state,payload){
        state.global.message = {
            'message':payload['message']
        }
    },
    updateEnvironmentMonitorData(state,payload){
        state.environmentMonitor = payload
    },
    updateEnvironmentMonitorDataByKey(state,payload){
        state.environmentMonitor[payload['key']] = payload['data']
    },
    addAttackerSelectedOperation(state,payload){
        state.attacker.selectedOperation.push(payload)
    },
    addDefenderSelectedOperation(state,payload){
        state.defender.selectedOperation.push(payload)
    },
    addAttackerHistoryOperation(state,payload){
        state.attacker.historyOperation.push(payload)
    },
    addDefenderHistoryOperation(state,payload){
        state.defender.historyOperation.push(payload)
    },
    updateAttackerHistoryOperation(state,payload){
        state.attacker.historyOperation = payload
    },
    updateDefenderHistoryOperation(state,payload){
        state.defender.historyOperation = payload
    },
    updateCurrentCopyFormData(state,payload){
        state.global.currentCopyFormData = payload
    },
    updateAttackerEnvironmentStatusSummaryMapByName(state,payload){
        state.attacker.environmentStatusSummaryMap[payload['name']] = payload['data']
    },
    updateAttackerEnvironmentStatusMapByName(state,payload){
        state.attacker.environmentStatusMap[payload['name']] = payload['data']
    },
    updateAttackerEnvironmentStatusDataMapByName(state,payload){
        state.attacker.environmentStatusMap[payload['name']]['envStatusResultDataList'] = payload['data']
    },
    updateDefenderEnvironmentStatusSummaryMapByName(state,payload){
        state.defender.environmentStatusSummaryMap[payload['name']] = payload['data']
    },
    updateDefenderEnvironmentStatusMapByName(state,payload){
        state.defender.environmentStatusMap[payload['name']] = payload['data']
    },
    updateDefenderEnvironmentStatusDataMapByName(state,payload){
        state.defender.environmentStatusMap[payload['name']]['envStatusResultDataList'] = payload['data']
    }
  },
  actions: {
    incrementAsync({ commit }, payload) { 
       // actions也应接受payload参数 
    }
  }
})

export default store