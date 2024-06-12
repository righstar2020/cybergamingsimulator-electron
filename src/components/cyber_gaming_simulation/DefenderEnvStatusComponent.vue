<template>
  <div class="defenderEnvStatusComponent">
    <el-scrollbar width="600px">
      <div class="defenderEnvStatusList">
        <div v-for="(item,index) in defenderStatusList" :key="index" class="defenderEnvStatusItem defender-statistic-info">
            <div class="defenderEnvStatusItem-title">{{ item.title }}</div>
             <el-row class="defenderEnvStatusItem-data">
              <el-col :span="8" v-for="(elem,i) in item.statisticDataList" :key="i">
                <el-statistic :title="elem.title" :value="elem.value" />
              </el-col>
            </el-row>
            <el-button type="primary"  size="small" @click="viewDetailEnvStatus(index)" >
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
  name: 'DefenderEnvStatusComponent',
  data() {
    return {
      defenderStatusList:[{
        title:'主机伪造',
        name:'defenderPortScanResult',
        statisticDataList:[{
          title:'总任务数',
          value:0
        },{
          title:'伪装主机数量',
          value:0
        },
        {
          title:'正在执行',
          value:0
        }]
      }]
    }

  },
  watch:{
  '$store.state.defender.environmentStatus'(newVal,oldVal){},
  '$store.state.defender.runningOperation'(newVal,oldVal){},
  '$store.state.defender.historyOperation'(newVal,oldVal){}
  },
  mounted() {
    
  },
  created() {
    
  },
  methods:{
    viewDetailEnvStatus(index){
      let currentDefenderStatusItem = this.defenderStatusList[index];
      let currentDefenderStatusTitle = currentDefenderStatusItem.title;
      let currentDefenderStatusName = currentDefenderStatusItem.name;
      const data = {
          title: currentDefenderStatusTitle,
          url: 'envStatusWindow/'+currentDefenderStatusName //使用路径参数
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
}
.defenderEnvStatusItem .defenderEnvStatusItem-data{
margin: 10px 0;
}
</style>
