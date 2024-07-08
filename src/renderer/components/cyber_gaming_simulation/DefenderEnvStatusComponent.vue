<template>
  <div class="defenderEnvStatusComponent">
    <el-scrollbar width="600px">
      <div class="defenderEnvStatusList">
        <div v-for="(item,key) in defenderStatusSummaryMap" :key="key" class="defenderEnvStatusItem defender-statistic-info">
            <div class="defenderEnvStatusItem-title">{{ item.title }}</div>
             <el-row class="defenderEnvStatusItem-data">
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
export default {
  name: 'DefenderEnvStatusComponent',
  data() {
    return {
      defenderStatusSummaryMap:{
          'defenderPortScan':{
            title:'端口扫描任务',
            name:'defenderPortScanResult',
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
    '$store.state.defender.environmentStatusMap'(newVal,oldVal){

    },
    '$store.state.defender.environmentStatusSummaryMap'(newVal,oldVal){
        this.defenderStatusSummaryMap = newVal
    },
    '$store.state.defender.historyOperation'(newVal,oldVal){

    }
  },
  mounted() {
    this.defenderStatusSummaryMap = this.$store.getters.getDefenderEnvStatusSummary
  },
  created() {
    this.defenderStatusSummaryMap = this.$store.getters.getDefenderEnvStatusSummary
    console.log(this.defenderStatusSummaryMap) 
  },
  methods:{
    viewDetailEnvStatus(key){
      let currentDefenderStatusItem = this.defenderStatusSummaryMap[key];
      let currentDefenderStatusTitle = currentDefenderStatusItem.title;
      let currentDefenderStatusName = currentDefenderStatusItem.name;
      const data = {
          title: currentDefenderStatusTitle,
          url: 'envStatusWindow/defender/'+currentDefenderStatusName //使用路径参数
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
.defenderEnvStatusComponent{
width: 100%;
}
.defenderEnvStatusList{
display: flex;
align-items: center;
justify-content: flex-start;
flex-wrap: wrap;
width: 100%;

}
.defenderEnvStatusList .defenderEnvStatusItem{
width: 100%;
padding-bottom: 10px;
}
.defenderEnvStatusItem .defenderEnvStatusItem-data{
margin: 10px 0;
}
</style>
