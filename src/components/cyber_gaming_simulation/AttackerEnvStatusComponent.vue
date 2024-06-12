<template>
    <div class="attackerEnvStatusComponent">
      <el-scrollbar width="600px">
        <div class="attackerEnvStatusList">
          <div v-for="(item,key) in attackerStatusSummaryMap" :key="key" class="attackerEnvStatusItem attacker-statistic-info">
              <div class="attackerEnvStatusItem-title">{{ item.title }}</div>
               <el-row class="attackerEnvStatusItem-data">
                <el-col :span="8" v-for="(elem,i) in item.statisticParams" :key="i">
                  <el-statistic :title="elem.title" :value="elem.value" />
                </el-col>
              </el-row>
              <el-button type="primary"  size="small" @click="viewDetailEnvStatus(key)" >
                  详细监控信息
              </el-button>
          </div>
        </div>        
      </el-scrollbar>
    </div>
  </template>
  
<script>
import * as echarts from "echarts";
export default {
    name: 'AttackerEnvStatusComponent',
    data() {
      return {
        attackerStatusSummaryMap:{
            'attackerPortScan':{
              title:'端口扫描任务',
              name:'attackerPortScanResult',
              statisticParams:[{
                title:'总任务数',
                value:0
              },{
                title:'正在执行',
                value:0
              },{
                title:'扫描结果',
                value:0
              }]
          }
        }
      }

    },
    watch:{
      '$store.state.attacker.environmentStatusMap'(newVal,oldVal){

      },
      '$store.state.attacker.environmentStatusSummaryMap'(newVal,oldVal){
          this.attackerStatusSummaryMap = newVal
      },
      '$store.state.attacker.historyOperation'(newVal,oldVal){

      }
    },
    mounted() {
      this.attackerStatusSummaryMap = this.$store.getters.getAttackerEnvStatusSummary
    },
    created() {
      this.attackerStatusSummaryMap = this.$store.getters.getAttackerEnvStatusSummary
      console.log(this.attackerStatusSummaryMap) 
    },
    methods:{
      viewDetailEnvStatus(key){
        let currentAttackerStatusItem = this.attackerStatusSummaryMap[key];
        let currentAttackerStatusTitle = currentAttackerStatusItem.title;
        let currentAttackerStatusName = currentAttackerStatusItem.name;
        const data = {
            title: currentAttackerStatusTitle,
            url: 'envStatusWindow/attacker/'+currentAttackerStatusName //使用路径参数
        };
        //创建新监控窗口
        this.$electron.ipcRenderer.send('open-new-window-by-local-url', data);
        console.log(this.$electron)
      }
    }
  }
</script>

  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.attackerEnvStatusComponent{
  width: 100%;
}
.attackerEnvStatusList{
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
}
.attackerEnvStatusList .attackerEnvStatusItem{
  width: 100%;
}
.attackerEnvStatusItem .attackerEnvStatusItem-data{
 margin: 10px 0;
}
  </style>
  