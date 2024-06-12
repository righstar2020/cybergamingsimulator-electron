<template>
  <div class="EnvStatusWindow">
    <div class="envStatusContainerTop">
      <div class="envStatusTitle">
        {{ envStatusSummary.title }}
      </div>
      <el-tag v-for="item,index in envStatusSummary.statisticParams" v-key="index">
        {{ item.title+':'+item.value  }}
      </el-tag>
     </div>
     <div class="envStatusChartContainer">
      <el-scrollbar height="400px" width="500px">
        <LineChartComponent v-if="currentEnvStatusName=='attackerPortScan'" :lineChartData="chartData"  ></LineChartComponent>
      </el-scrollbar>     
     </div>
     <div class="envStatusDataTableContainer">
        <div  class="envStatusDataTableItem">
           <div class="envStatusDataTableTop">
             <div class="envStatusDataTableTitle">
              {{ envStatusResult.title }}
             </div>
             <div class="envStatusDataTableMenus">
              <el-button type="primary"  size="small" @click="updateEnvStatusResultData()" >
                  刷新结果
              </el-button>
             </div>
           </div>
           <div class="envStatusDataTablebody">
            <el-table :data="envStatusResult.envStatusResultDataList">
            <!-- <el-table-column width="100" property="operation_link_id" label="操作链ID" /> -->
            <el-table-column width="100" property="id" label="任务ID" />
            <el-table-column width="100" property="title" label="操作名" />
            <el-table-column width="100" property="statusTitle" label="状态" >
              <template #default="scope_status">
                <el-tag>{{ scope_status.row.statusTitle  }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column  min-width="150" v-for="(elem,i) in envStatusResult.envStatusResultLabelList"  :property="elem.name" :label="elem.title">
            </el-table-column>
            <el-table-column fixed="right" width="140" property="result" label="结果" >
              <template #default="scope_result" >
                <el-button :loading="scope_result.row.status=='running'" type="primary" size="small"  @click="viewStatusDetailResult(index)">
                    {{scope_result.row.status=='running'?'处理中':'详细结果'}}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
           </div>
        </div>
     </div>
  </div>
</template>

<script>
import LineChartComponent from '@/components/chart_components/LineChartComponent.vue'
import { deepCopy } from '@/util';
export default {
  name: 'EnvStatusWindow',
  components:{
    LineChartComponent:LineChartComponent
  },
  data() {
    return{
      currentEnvStatusName: '',
      envStatusHeadInfo:{
        title:'empty status',
        statisticParams:[]
      },
      envStatusResult:{

      },
      envStatusSummary:{
    
      },
      chartData:{}
    } 
  },
  watch:{
    '$store.state.attacker.environmentStatusMap'(newVal,oldVal){
        console.log("new attacker.environmentStatusMap:")
        console.log(newVal)
        let currentEnvStatusName=this.$route.params.statusName;
        this.envStatusResult[currentEnvStatusName] = newVal[currentEnvStatusName]
        this.processTaskResultDataToLineChart(newVal[currentEnvStatusName])
    },
    '$store.state.attacker.environmentStatusSummaryMap'(newVal,oldVal){
        let currentEnvStatusName=this.$route.params.statusName;
        this.envStatusSummary = newVal[currentEnvStatusName]
    }
  },
  created(){
    let currentEnvStatusName=this.$route.params.statusName;
    this.envStatusSummary = this.$store.getters.getAttackerEnvStatusSummary[currentEnvStatusName]
    this.envStatusResult = this.$store.getters.getAttackerEnvStatus[currentEnvStatusName]
    console.log(this.envStatusSummaryMap)
    console.log(this.envStatusResultData)
    if(currentEnvStatusName!=''){
      this.currentEnvStatusName = currentEnvStatusName;
    }
    this.processTaskResultDataToLineChart(this.envStatusResult)
    setTimeout(()=>{
      this.updateChartData()
    },5000)
  },
  mounted() {
    let player=this.$route.params.player;
    let currentEnvStatusName=this.$route.params.statusName;
    this.envStatusSummary = this.$store.getters.getAttackerEnvStatusSummary[currentEnvStatusName]
    this.envStatusResult = this.$store.getters.getAttackerEnvStatus[currentEnvStatusName]
    if(currentEnvStatusName!=''){
      this.currentEnvStatusName = currentEnvStatusName;
    }
    this.processTaskResultDataToLineChart(this.envStatusResult)
  },
  methods: {
    formatTimestamp() {
      const date = new Date(this.timestamp);
      const hours = ('0' + date.getHours()).slice(-2); // 保证始终为两位数，不足补0
      const minutes = ('0' + date.getMinutes()).slice(-2);
      const seconds = ('0' + date.getSeconds()).slice(-2);
      this.formattedTime = `${hours}:${minutes}:${seconds}`;
    },
    changeEnvStatus(envStatusName) {
      this.currentEnvStatusName = envStatusName;
    },
    updateEnvStatusResultData(index){

    },
    viewStatusDetailResult(index){

    },
    updateChartData(){
      let currentEnvStatusName=this.$route.params.statusName;
      this.envStatusSummary = this.$store.getters.getAttackerEnvStatusSummary[currentEnvStatusName]
      this.envStatusResult = this.$store.getters.getAttackerEnvStatus[currentEnvStatusName]
      console.log("updateChartData: ")
      console.log(this.envStatusSummaryMap)
      console.log(this.envStatusResultData)
      if(currentEnvStatusName!=''){
        this.currentEnvStatusName = currentEnvStatusName;
      }
      this.processTaskResultDataToLineChart(this.envStatusResult)
    },
    processTaskResultDataToLineChart(envStatusResult){
      console.log(envStatusResult)
        let envStatusResultDataList = envStatusResult['envStatusResultDataList']
        if(envStatusResultDataList == undefined){
          console.log("proccess chart data:no data")
          return
        }
        console.log("proccess chart data:")
        console.log(envStatusResultDataList)
        // let envStatusResultDataItem = {
        //     id:task['id'],
        //     operation_link_id:task['operation_link_id'],
        //     task_id:task_id,
        //     title:'端口扫描',
        //     statusTitle:task['status']=='running'?'扫描中':'扫描完成',
        //     status:task['status'],
        //     target_ip:task['params']['target_ip'],
        //     port:'',
        //     response_time:''
        // }
        let xAxisDataLength = 0
        let xAxisData = []
        let legendDataMap = {}
        let legendData = []
        let seriesDataMap = {}
        let seriesData = []
        for(let i=0;i<envStatusResultDataList.length;i++){
          let envStatusResulData = envStatusResultDataList[i]
          if(legendDataMap[envStatusResulData['target_ip']] == undefined){
            legendDataMap[envStatusResulData['target_ip']]=true
            legendData.push(envStatusResulData['target_ip'])
            seriesDataMap[envStatusResulData['target_ip']]=[]
          }
          if(legendDataMap[envStatusResulData['target_ip']]){
            seriesDataMap[envStatusResulData['target_ip']].push(envStatusResulData['response_time']*1000)          
          }
        }
        Object.keys(seriesDataMap).forEach((key)=>{
          let value = seriesDataMap[key]
          let seriesDataItem = {
            name:key,
            data:value
          }
          seriesData.push(deepCopy(seriesDataItem))
          xAxisDataLength = xAxisDataLength<value.length?value.length:xAxisDataLength
        })
        for(let i=0;i<xAxisDataLength;i++)
           xAxisData.push('round '+(i+1))
        let lineChartData = {
          chartId:'lineChart',
          title:'端口扫描时间',
          xAxisData: xAxisData,
          yAxisData: [],
          yAxisLabel:{},
          legendData: legendData,
          seriesData: seriesData
        }
        this.chartData = lineChartData
        console.log('lineChartData:')
        console.log(lineChartData)
        return lineChartData
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.EnvStatusWindow{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.EnvStatusWindow .envStatusContainerTop{
  width:100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid gainsboro;
}
.envStatusContainerTop .envStatusTitle{
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  padding: 10px;
}
.envStatusContainerTop .el-tag{
  margin-left: 10px;
}
.envStatusChartContainer{
  padding: 10px;
  width: 100%;
  border-bottom: 1px solid gainsboro;
}

.envStatusDataTableContainer{
  width: 100%;
  border-bottom: 1px solid gainsboro;
  padding-bottom: 30px;
}
.envStatusDataTableContainer .envStatusDataTableItem{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;

}
.envStatusDataTableItem .envStatusDataTablebody{
 width: 100%;
 text-align: left;
}
.envStatusDataTableItem .envStatusDataTableTop{
 width: 100%;
 display: flex;
 align-items: center;
 justify-content: flex-start;
}
.envStatusDataTableTop .envStatusDataTableTitle{
  font-size: 24px;
  font-weight: bold;
  text-align: left;
  padding: 10px;
}
.envStatusDataTableTop .envStatusDataTableMenus{
  position: absolute;
  right: 10px;
}
</style>
