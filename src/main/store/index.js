// store/index.js
import { createStore } from 'vuex'
let store = createStore({
  state: {
    global:{
        currentCopyFormData:{},
        message:{
            message:''
        },
        networkConfigData:{
            currentNetworkMode:{
                title:'网络模式',
                formType:'select',
                selectOptions:['local','remote'],
                value:'local'
            },
            currentTopoName:{
                title:'当前网络拓扑',
                formType:'select',
                selectOptions:['Aranet','自定义'],
                value:'Aranet'
            },
            backgroundServerUrl:{
                title:'后端地址',
                formType:'input',
                value:'http://172.22.107.94:5000'
            }
        }
    },
    gamingStatus:{
        totalStepNum:0,
        currentGameRound:0,
        currentPlayer:'attacker',
        attackerOperationNum:0,
        defenderOperationNum:0
    },
    attacker:{
        baseOperation:{
            signal:[{
                title:'主机扫描',
                name:'host_scan',
                operationType:'signal',
                clientType:'host',
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
            // {
            //     title:'链路测绘',
            //     name:'link_scope',
            //     operationType:'signal',
            //     clientType:'host',
            //     description:'对到达目标区域的关键链路进行进行测绘.\n 参数:client_ip->执行主机IP,target_ip->目标主机 \n返回结果:链路状态(延迟等)',
            //     params:[{
            //         title:'执行主机IP',
            //         name:'client_ip',
            //         formType:'input',
            //         type:'text'
            //     },{
            //         title:'目标主机IP',
            //         name:'target_ip',
            //         formType:'input',
            //         type:'text'
            //     }]
            // }
            ],
            action:[{
                title:'攻击目标主机',
                name:'host_attack',
                operationType:'action',
                clientType:'host',
                description:'对特定主机进行DDoS攻击.\n 参数:client_ip->执行主机IP,target_ip->目标主机 \n attack_type->攻击类型(ICMP,UDP,SYN) \n',
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
                },{
                    title:'攻击类型',
                    name:'attack_type',
                    formType:'select',
                    selectOptions:['ICMP','SYN','UDP'],
                    type:'text'
                },{
                    title:'持续时间',
                    name:'duration',
                    formType:'input',
                    type:'text'
                }]
              },
              {
                title:'攻击目标链路',
                name:'link_attack',
                operationType:'action',
                clientType:'host',
                description:'对特定链路进行攻击.\n 参数:client_ip->执行主机IP,target_ip->傀儡机IP',
                params:[{
                    title:'执行主机IP',
                    name:'client_ip',
                    formType:'input',
                    type:'text'
                },{
                    title:'傀儡机IP',
                    name:'target_ip',
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
            },
            "attackerDDoSAttack":{
                title:'DDoS攻击任务',
                name:'attackerDDoSAttack',
                statisticParams:[{
                  title:'总任务数',
                  name:'total_task_num',
                  value:0
                },{
                  title:'正在执行',
                  name:'running_task_num',
                  value:0
                },{
                  title:'执行完成',
                  name:'attack_result_num',
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
            },
            "attackerDDoSAttack":{
                title:'DDoS攻击任务',
                envStatusResultLabelList:[{
                  name:'target_ip',
                  title:'目标IP'
                },{
                  name:'attack_type',
                  title:'攻击类型'
                },{
                    name:'duration',
                    title:'持续时间'
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
                clientType:'host',
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
            // {
            //     title:'traceroute欺骗',
            //     name:'link_scope_deception',
            //     operationType:'signal',
            //     description:'指示特定链路不支持traceroute规则,TTL随机衰减,达到混淆效果.\n 参数:ip_source->链路起始主机IP,ip_destination->链路终点主机IP \n返回结果:链路状态(延迟等)',
            //     params:[{
            //         title:'起始节点IP',
            //         name:'ip_source',
            //         formType:'input',
            //         type:'text'
            //     },{
            //         title:'终止节点IP',
            //         name:'ip_destination',
            //         formType:'input',
            //         type:'text'
            //     }]
            // }
            ],
            action:[{
                title:'协议封禁',
                name:'host_protocol_forbid',
                operationType:'action',
                clientType:'switch',
                description:'在特定主机或交换机上进行特定协议封禁.\n 参数:dpid->交换机dpid,protocol->协议类型(icmp/udp) \n返回结果:主机状态',
                params:[{
                    title:'交换机dpid',
                    name:'dpid',
                    formType:'input',
                    type:'text'
                },
                {
                    title:'协议名称',
                    name:'protocol',
                    formType:'select',
                    selectOptions:['ICMP','TCP','UDP'],
                    type:'text'
                }
                ]
              },{
                title:'白名单',
                name:'ip_white_table',
                operationType:'action',
                clientType:'switch',
                description:'在特定交换机上使用白名单进行流量过滤.\n 参数:dpid->交换机dpid \n返回结果:主机状态',
                params:[{
                    title:'交换机DPID',
                    name:'dpid',
                    formType:'input',
                    type:'text'
                }]
              },{
                title:'流量过滤',
                name:'host_traffic_filter',
                operationType:'action',
                clientType:'switch',
                description:'在特定交换机上部署流量过滤器.\n 参数:dpid->交换机dpid \n返回结果:主机状态',
                params:[{
                    title:'节点IP',
                    name:'targetIp',
                    formType:'input',
                    type:'text'
                }]
              },
            ]
        },
        selectedOperation:[],
        runningOperation:[],
        historyOperation:[],
        environmentStatusSummaryMap:{
            "defenderHostDeception":{
                title:'端口伪装任务',
                name:'defenderHostDeception',
                statisticParams:[{
                  title:'总任务数',
                  name:'total_task_num',
                  value:0
                },{
                  title:'正在执行',
                  name:'running_task_num',
                  value:0
                },{
                  title:'执行完成',
                  name:'deception_result_num',
                  value:0
                }]
            },
            "defenderDefendTask":{
                title:'防御任务',
                name:'defenderDefendTask',
                statisticParams:[{
                  title:'总任务数',
                  name:'total_task_num',
                  value:0
                },{
                  title:'正在执行',
                  name:'running_task_num',
                  value:0
                },{
                  title:'执行完成',
                  name:'defend_result_num',
                  value:0
                }]
            }
        },
        environmentStatusMap:{
            "defenderHostDeception":{
                title:'端口伪装任务',
                envStatusResultLabelList:[{
                    name:'client_ip',
                    title:'执行主机'
                },{
                    name:'port',
                    title:'伪装端口'
                },{
                    title:'请求延迟min',
                    name:'request_delay_min'
                },{
                    title:'请求延迟max',
                    name:'request_delay_max'
                }],
                envStatusResultDataList:[]
            },
            "defenderDefendTask":{
                title:'防御任务',
                envStatusResultLabelList:[{
                    name:'title',
                    title:'任务名称'
                },{
                    name:'dpid',
                    title:'交换机dpid'
                }],
                envStatusResultDataList:[]
              }
        },
        config:{}
    },    
    environmentMonitor:{
        networkDynamicMapData:{},
        taskHistoryData:[],
        headerDigitalData:{
            "totalOperationNum":{
              'title':'总操作数',
              'number':0,
              'fill_color':'#4d99fc',
              'unit':''
            },
            "attackerOperationNum":{
              'title':'攻击操作',
              'number':0,
              'fill_color':'#f46827',
              'unit':'次'
            },
            "defenderOperationNum":{
              'title':'防御操作',
              'number':0,
              'fill_color':'#40faee',
              'unit':'次'
            },
            "currentGameRound":{
              'title':'当前轮次',
              'number':0,
              'fill_color':'#4d99fc',
              'unit':'次'
            },
            "usefulBandwidth":{
              'title':'可用带宽容量',
              'number':0,
              'fill_color':'#4d99fc',
              'unit':'Mbps'
            },
            "avgDelay":{
              'title':'平均时延',
              'number':0,
              'fill_color':'#4d99fc',
              'unit':'ms'
            },
            "avgPktLossRate":{
              'title':'平均丢包率',
              'number':0,
              'fill_color':'#4d99fc',
              'unit':'%'
            }
        },
        operationRankData:{
            'host_scan':{
                'name':'端口扫描',
                'player':'attacker',
                'value':0
            },
            'host_attack':{
                'name':'DDoS攻击',
                'player':'attacker',
                'value':0
            },
            'host_deception':{
                'name':'端口伪装',
                'player':'defender',
                'value':0
            },
            'host_protocol_forbid':{
                'name':'协议封禁',
                'player':'defender',
                'value':0
            }
        },
        trafficFlowData:{
            'timestamp_list':[],
            'total_flow_bytes':[]
        },
        trafficEntropyData:{
            'source_ips_entropy':[],
            'destination_ports_entropy':[],
            'timestamp':[]
        },
        envData:{
            cpu_percent:0,
            memory_percent:0,
            protocol_data:{}
        }
    }
  },
  getters: {
    getAllStateData(state){
        return state
    },
    getGlobalData(state){
        return state.global
    },
    getNetworkConfigData(state){
        return state.global.networkConfigData
    },
    getGamingStatus(state){
        return state.gamingStatus
    },
    getHeaderDigitalData(state){
        return state.environmentMonitor.headerDigitalData
    },
    getTaskHistoryData(state){
        return state.environmentMonitor.taskHistoryData
    },
    getOperationRankData(state){
        return state.environmentMonitor.operationRankData
    },
    getEnvironmentMonitorData(state){
        return state.environmentMonitor
    },
    getNetworkDynamicMapData(state){
        return state.environmentMonitor['networkDynamicMapData']
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
    updateAllStateData(state,payload){
        state = payload
    },
    updateGlobalData(state,payload){
        state.global = payload
    },
    updateNetworkConfigData(state,payload){
        state.global.networkConfigData = payload
    },
    updateGamingStatus(state,payload){
        state.gamingStatus = payload
    },
    updateTaskHistoryData(state,payload){
        state.environmentMonitor.taskHistoryData = payload
    },
    updateOperationRankData(state,payload){
        state.environmentMonitor.operationRankData = payload
    },
    updateHeaderDigitalData(state,payload){
        state.environmentMonitor.headerDigitalData = payload
    },
    updateEnvironmentMonitorData(state,payload){
        state.environmentMonitor = payload
    },
    updateNetworkDynamicMapData(state,payload){
        state.environmentMonitor['networkDynamicMapData'] = payload
    },
    updateEnvStatusData(state,payload){
        state.environmentMonitor['envData'] = payload
    },
    updateEnvStatusDataByKey(state,payload){
        state.environmentMonitor['envData'][payload['key']] = payload['data']
    },
    updateTrafficFlowData(state,payload){
        state.environmentMonitor['trafficFlowData'] = payload
    },
    updateTrafficEntropyData(state,payload){
        state.environmentMonitor['trafficEntropyData'] = payload
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
    updateAttackerEnvironmentStatusSummary(state,payload){
        state.attacker.environmentStatusSummaryMap = payload
    },
    updateAttackerEnvironmentStatusMap(state,payload){
        state.attacker.environmentStatusMap = payload
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
    updateDefenderEnvironmentStatusSummary(state,payload){
        state.defender.environmentStatusSummaryMap = payload
    },
    updateDefenderEnvironmentStatusMap(state,payload){
        state.defender.environmentStatusMap = payload
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