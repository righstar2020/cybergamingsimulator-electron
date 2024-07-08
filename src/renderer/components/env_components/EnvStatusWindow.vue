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
        <PortScanLineChart v-if="currentEnvStatusName=='attackerPortScan'" :taskData="taskData" ></PortScanLineChart>
        <DDoSAttackLineChart v-if="currentEnvStatusName=='attackerDDoSAttack'" :taskData="taskData" ></DDoSAttackLineChart>
      </el-scrollbar>     
     </div>
     <div class="envStatusDataTableContainer">
        <div  class="envStatusDataTableItem">
           <div class="envStatusDataTableTop">
             <div class="envStatusDataTableTitle">
              {{ envStatusResult.title }}
             </div>
             <div class="envStatusDataTableMenus">
              <el-button type="primary"  size="small" @click="updateEnvStatusResultData" >
                  刷新结果
              </el-button>
             </div>
           </div>
           <div class="envStatusDataTablebody">
            <el-table :data="envStatusResult.envStatusResultDataList">
            <el-table-column width="100" property="task_id" label="任务ID" />
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
import PortScanLineChart from '@/components/chart_components/PortScanLineChart.vue'
import DDoSAttackLineChart from '@/components/chart_components/DDoSAttackLineChart.vue'
import { deepCopy } from '@/util';
export default {
  name: 'EnvStatusWindow',
  components:{
    PortScanLineChart:PortScanLineChart,
    DDoSAttackLineChart:DDoSAttackLineChart
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
      taskData:{}
    } 
  },
  watch:{
    '$store.state.attacker.environmentStatusMap'(newVal,oldVal){
        let player=this.$route.params.player;
        let currentEnvStatusName=this.$route.params.statusName;
        if(player != 'attacker')
            return
        console.log("new attacker.environmentStatusMap:")
        console.log(newVal)
        this.envStatusResult = newVal[currentEnvStatusName]
        this.processTaskResultDataToChartData(newVal[currentEnvStatusName])
    },
    '$store.state.attacker.environmentStatusSummaryMap'(newVal,oldVal){
        let player=this.$route.params.player;
          if(player != 'attacker')
              return
        let currentEnvStatusName=this.$route.params.statusName;
        this.envStatusSummary = newVal[currentEnvStatusName]
    },
    '$store.state.defender.environmentStatusMap'(newVal,oldVal){
        let player=this.$route.params.player;
        let currentEnvStatusName=this.$route.params.statusName;
        if(player != 'defender')
            return
        console.log("new defender.environmentStatusMap:")
        console.log(newVal)
        this.envStatusResult = newVal[currentEnvStatusName]
        this.processTaskResultDataToChartData(newVal[currentEnvStatusName])
    },
    '$store.state.defender.environmentStatusSummaryMap'(newVal,oldVal){
        let player=this.$route.params.player;
        let currentEnvStatusName=this.$route.params.statusName;
          if(player != 'defender')
              return
        
        this.envStatusSummary = newVal[currentEnvStatusName]
    }
  },
  created(){
    
    this.$nextTick(()=>{
      this.updateChartData()
    })
  },
  mounted() {

  },
  methods: {
    updateEnvStatusResultData(index){
      this.updateChartData()
    },
    viewStatusDetailResult(index){

    },
    updateChartData(){
      let player=this.$route.params.player;
      let currentEnvStatusName=this.$route.params.statusName;
      if(player == 'attacker'){
        this.envStatusSummary = this.$store.getters.getAttackerEnvStatusSummary[currentEnvStatusName]
        this.envStatusResult = this.$store.getters.getAttackerEnvStatus[currentEnvStatusName]
      }else{
        this.envStatusSummary = this.$store.getters.getDefenderEnvStatusSummary[currentEnvStatusName]
        this.envStatusResult = this.$store.getters.getDefenderEnvStatus[currentEnvStatusName]
      }

      if(currentEnvStatusName!=''){
        this.currentEnvStatusName = currentEnvStatusName;
      }
      
      this.processTaskResultDataToChartData(this.envStatusResult)
    },
    processTaskResultDataToChartData(newTaskData){
      this.taskData = newTaskData
    },
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
