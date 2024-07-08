<template>
  <div id="operations-ranking-board">
    <div class="operations-ranking-board-title">操作数量排行</div>
    <dv-scroll-ranking-board :config="option" />
  </div>
</template>

<script>
import {deepCopy} from "@/util/index.js";
export default {
  name: 'OperationsRankingBoard',
  data () {
    return {
      option: {
        data: [
        ],
        rowNum: 0
      }
    }
  },
  watch:{
    '$store.state.environmentMonitor.operationRankData'(newVal,oldVal){
      console.log("operationRankData:",newVal)
      if(newVal!=undefined){
        this.updataOptionData(newVal)
      }
      
    }
  },
  created() {
    this.$nextTick(() => {
      let operationRankData = this.$store.getters.getEnvironmentMonitorData['operationRankData']
      if(operationRankData!=undefined)
          this.updataOptionData(operationRankData)
    });
  },
  methods: {
    updataOptionData(operationRankData){
      let optionData = this.option
      let operationRankDataList = Object.values(operationRankData)
      if(operationRankDataList.length==0){
        return
      }
      //一定要创建新对象不然图表不会更新
      let option = {
        data: new Array(Object.values(operationRankData).length).fill(0).map((foo,i)=>{
          return operationRankDataList[i]
        }),
        rowNum: Object.values(operationRankData).length
      }
      
      this.option = option
    }
  }
}
</script>

<style lang="less">
#operations-ranking-board {
  width: 100%;
  height: 100%;
  box-shadow: 0 0 3px blue;
  display: flex;
  flex-direction: column;
  background-color: rgba(6, 30, 93, 0.5);
  border-top: 2px solid rgba(1, 153, 209, .5);
  box-sizing: border-box;
  padding: 0px 30px;

  .operations-ranking-board-title {
    font-weight: bold;
    height: 50px;
    display: flex;
    align-items: center;
    font-size: 20px;
  }

  .dv-scroll-ranking-board {
    flex: 1;
    height: 90%;
  }
}
</style>
