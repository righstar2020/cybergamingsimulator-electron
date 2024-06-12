import store from '@/store';
import { descriptionProps } from 'element-plus';
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
                    data:[{
                        '执行时间':'Wed Jun 12 2024 17:05:31',
                        '操作名称':'端口扫描',
                        '执行主机':'',
                        '目标主机':'',
                        '参数':'',
                        '执行结果':''
                    }]
                }
            ],
            has_chart:true,
            chart_data:[{
                chart_title:'攻击者操作链',
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
                    data:[{
                        '执行时间':'Wed Jun 12 2024 17:05:31',
                        '操作名称':'端口伪装',
                        '执行主机':'',
                        '目标主机':'',
                        '参数':'',
                        '执行结果':''
                    }]
                }
            ],
            has_chart:true,
            chart_data:[{
                chart_title:'防御者操作链',
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
                chart_base64_content:''
            },{
                chart_title:'流量熵',
                chart_base64_content:''
            }]
        },

    ]
}

function generate_report_chart_content(){

}
function generate_report_data() {
    var attacker_operation_list = store.getters.getAttackerHistoryOperation;
    var defender_operation_list = store.getters.getDefenderHistoryOperation;
    var report = report
    console.log(attacker_operation_list)
    console.log(defender_operation_list)

    return report
}
export {
    generate_report_data
}