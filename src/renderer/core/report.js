import store from '@/store';
//生成分析报告的数据预处理操作

const  report= {
    title:'DDoS攻防分析报告',
    create_time:'Wed Jun 12 2024 17:05:31',
    description:'',
    report_data:[
        {
            title:'基本信息',
            description:'攻防双方的基本信息.',
            has_table:true,
            table_data:[{
                table_title:'基本信息列表',
                keys:['player','操作次数','操作成功数'],
                data:[{
                    'palyer':'攻击者',
                    '操作次数':100,
                    '操作成功数':100
                },{
                    'palyer':'防御者',
                    '操作次数':100,
                    '操作成功数':100
                }]
            }],
            has_chart:false,
            chart_data:[]
        },{
            title:'攻击操作',
            description:'攻击者进行的攻击操作详情.',
            has_table:true,
            table_data:[
                {   
                    table_title:'攻击操作列表',
                    keys:['执行时间','操作名称','执行主机','目标主机','参数','执行结果',],
                    data:[]
                }
            ],
            has_chart:false,
            chart_data:[{
                chart_title:'攻击者操作链',
                echart_option:null,
                chart_base64_content:''
            }]
        },{
            title:'防御操作',
            description:'防御者进行的防御操作详情.',
            has_table:true,
            table_data:[
                {   
                    table_title:'防御操作列表',
                    keys:['执行时间','操作名称','执行主机','目标主机','参数','执行结果',],
                    data:[]
                }
            ],
            has_chart:false,
            chart_data:[{
                chart_title:'防御者操作链',
                echart_name:null,
                echart_option:null,
                chart_base64_content:''
            }]
        },{
            title:'攻防拓扑',
            description:'攻击者和防御者所进行的操作在拓扑图上的展示.',
            has_table:false,
            table_data:[],
            has_chart:true,
            chart_data:[{
                chart_title:'攻防拓扑图',
                echart_name:'networkDynamicFlyMap',
                echart_option:null,
                chart_base64_content:''
            }]
        },{
            title:'网络状态变化',
            description:'攻防过程的网络状态变化.包括流量峰值变化、流量熵指标变化',
            has_table:false,
            table_data:[],
            has_chart:true,
            chart_data:[{
                chart_title:'峰值变化',
                echart_name:'trafficFlowChart',
                echart_option:null,
                chart_base64_content:''
            },{
                chart_title:'流量熵',
                echart_name:'trafficEntropyChart',
                echart_option:null,
                chart_base64_content:''
            }]
        },

    ]
}


function formatDateTime(date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1 + '').padStart(2, '0')
    const day = (date.getDate() + '').padStart(2, '0')
    const hour = (date.getHours() + '').padStart(2, '0')
    const minute = (date.getMinutes() + '').padStart(2, '0')
    const second = (date.getSeconds() + '').padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

function proccess_attacker_history(report,taskHistoryData,attackerTaskHistorylist){
    
    var attacker_operation_list = taskHistoryData.filter(item=>item[0]=='攻击者')
    console.log('attacker_operation_list',attacker_operation_list)
    console.log("attackerTaskHistorylist",attackerTaskHistorylist)
    report['report_data'][1]['table_data'][0]['data']=new Array(attacker_operation_list.length).fill(0).map((foo,i)=>{
        return [
            attacker_operation_list[i][1],
            attacker_operation_list[i][2],
            attacker_operation_list[i][3],
            attackerTaskHistorylist[i]['target_ip']==undefined?'':attackerTaskHistorylist[i]['target_ip'],
            attackerTaskHistorylist[i]['params'],
            attackerTaskHistorylist[i]['result']==undefined?'':attackerTaskHistorylist[i]['result']
        ]
    })
    return report
}
function proccess_defender_history(report,taskHistoryData,defenderTaskHistorylist){
    console.log('taskHistoryData',taskHistoryData)
    var defender_operation_list = taskHistoryData.filter(item=>item[0]=='防御者')
    report['report_data'][2]['table_data'][0]['data']=new Array(defender_operation_list.length).fill(0).map((foo,i)=>{
        return [
            defender_operation_list[i][1],
            defender_operation_list[i][2],
            defender_operation_list[i][3],
            defender_operation_list[i][4]
        ]
    })
    return report
}
function proccess_echart_name(report){
    return report
}
function proccess_base_information(report,headerDigitalData,gameStatus){
    report['report_data'][0]['table_data'][0]['data'][0]['操作次数']=headerDigitalData['attackerOperationNum']['number']
    report['report_data'][0]['table_data'][0]['data'][0]['操作成功数']=headerDigitalData['attackerOperationNum']['number']
    report['report_data'][0]['table_data'][0]['data'][1]['操作次数']=headerDigitalData['defenderOperationNum']['number']
    report['report_data'][0]['table_data'][0]['data'][1]['操作成功数']=headerDigitalData['defenderOperationNum']['number']
    return report
}
function generate_report_data() {
    
    let headerDigitalData = store.getters.getHeaderDigitalData
    let taskHistoryData = store.getters.getEnvironmentMonitorData['taskHistoryData']
    let attackerTaskHistorylist = store.getters.getAttackerHistoryOperation
    let defenderTaskHistorylist = store.getters.getDefenderHistoryOperation
    let gameStatus = store.getters.getGamingStatus
    let report_result = report
    report_result['create_time'] =  formatDateTime(new Date())
    report_result = proccess_base_information(report_result,headerDigitalData,gameStatus)
    report_result = proccess_attacker_history(report_result,taskHistoryData,attackerTaskHistorylist)
    report_result = proccess_defender_history(report_result,taskHistoryData,defenderTaskHistorylist)
    report_result = proccess_echart_name(report_result)
    return report_result
}
export  {
    generate_report_data
}