<template>
  <div id="scroll-board">
    <dv-scroll-board :config="option" />
  </div>
</template>

<script>
import {deepCopy} from "@/util/index.js";
export default {
  name: 'BodyScrollBoard',
  data () {
    return {
      option: {
        header: ['player','时间', '操作'],
        data: [
        ],
        index: true,
        columnWidth: [50, 50, 300],
        align: ['center'],
        rowNum: 7,
        headerBGC: '#1981f6',
        headerHeight: 45,
        oddRowBGC: 'rgba(0, 44, 81, 0.8)',
        evenRowBGC: 'rgba(10, 29, 50, 0.8)'
      }
    }
  },
  watch:{
    '$store.state.environmentMonitor.taskHistoryData'(newVal,oldVal){
      console.log("taskHistoryData:",newVal)
      if(newVal!=undefined&&newVal.length>0){
        let latestTask = newVal[newVal.length-1]
        this.updataOptionData(newVal)
        this.$message.success(latestTask[0]+"执行新操作")
      }
        
    }
  },
  created() {
    this.$nextTick(() => {
      let taskHistoryData = this.$store.getters.getEnvironmentMonitorData['taskHistoryData']
      if(taskHistoryData)
        this.updataOptionData(taskHistoryData)
    });
  },
  methods:{
    updataOptionData(taskHistoryData){
      let optionData = this.option
      console.log("taskHistoryData",taskHistoryData)
      //taskHistoryData = taskHistoryData.reverse().splice(0,6).reverse() //取后6个操作
      let option = {
        header: ['player','时间', '操作'],
        data: new Array(taskHistoryData.length).fill(0).map((foo,i)=>{
          return [
            taskHistoryData[i][0],
            taskHistoryData[i][1],
            taskHistoryData[i][2]
          ]
        }),
        index: true,
        columnWidth: [100, 100, 200, 200],
        align: ['center'],
        rowNum: 6,
        headerBGC: '#1981f6',
        headerHeight: 45,
        oddRowBGC: 'rgba(0, 44, 81, 0.8)',
        evenRowBGC: 'rgba(10, 29, 50, 0.8)'
      }

      this.option =  option
    }
  }
}
</script>

<style lang="less">
#scroll-board {
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;
  .dv-scroll-board{
    height: 100%;
    width: 100%;
  }
}
</style>
