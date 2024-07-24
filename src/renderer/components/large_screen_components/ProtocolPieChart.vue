<template>
  <div id="protocol-pie-chart">
    <div class="protocol-pie-chart-title">协议比例</div>
    <!-- <div id="pieChart" style="width: 100%;height: 100%;"></div> -->
    <dv-charts :option="option" />
  </div>
</template>

<script>
import {deepCopy} from "@/util/index.js";
// import * as echarts from "echarts";
export default {
  name: 'protocolPieChart',
  data () {
    return {
      option: {
        series: [
          {
            type: 'pie',
            radius: '50%',
            trafficSort: false,
            data:[{name:'ICMP',value:1},{name:'TCP',value:1},{name:'UDP',value:1},{name:'other',value:1}],
            insideLabel: {
              show: false
            },
            outsideLabel: {
              formatter: '{name} {percent}%',
              labelLineEndLength: 20,
              style: {
                fill: '#fff'
              },
              labelLineStyle: {
                stroke: '#fff'
              }
            },
             trafficType: true
          }
        ],
        color: ['#da2f00', '#fa3600',  '#5d1400', '#b72700']
      },
      pieChart:null
    }
  },
  watch:{
    '$store.state.environmentMonitor.envData.protocol_data'(newVal,oldVal){
      if(newVal!=undefined&&newVal['TCP']!=0){
        // console.log("protocol_data:",newVal)
        this.updataChartData(newVal)
      }
    }
  },
  created() {
    this.$nextTick(() => {
      let protocol_data = this.$store.getters.getEnvironmentMonitorData['envData']['protocol_data']
      if(protocol_data!=undefined&&protocol_data['TCP']!=0){
        // this.initPieChart()
        console.log("protocol_data",protocol_data)
        this.updataChartData(protocol_data)
      }
    });
  },
  methods: {
    initPieChart() {
        this.pieChart = echarts.init(document.getElementById('pieChart'),'dark');
    },
    updataChartData (chartData) {
      if(chartData==undefined||Object.keys(chartData).length==0)return
      let option = {
        series: [
          {
            type: 'pie',
            radius: '50%',
            trafficSort: false,
            data: new Array(Object.keys(chartData).length).fill(0).map((foo, i) => ({
              name:Object.keys(chartData)[i],
              value:Object.values(chartData)[i]
            })),
            insideLabel: {
              show: false
            },
            outsideLabel: {
              formatter: '{name} {percent}%',
              labelLineEndLength: 20,
              style: {
                fill: '#fff'
              },
              labelLineStyle: {
                stroke: '#fff'
              }
            },
             trafficType: true
          }
        ],
        color: ['#da2f00', '#fa3600',  '#5d1400', '#b72700']
      }
      this.option = option
      // this.pieChart.setOption(option)
    },
    randomExtend (minNum, maxNum) {
      if (arguments.length === 1) {
        return parseInt(Math.random() * minNum + 1, 10)
      } else {
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
      }
    }
  },
 
}
</script>

<style lang="less">
#protocol-pie-chart {
  width: 100%;
  height: 100%;
  background-color: rgba(6, 30, 93, 0.5);
  border-top: 2px solid rgba(229, 60, 27, 0.807);
  box-sizing: border-box;

  .protocol-pie-chart-title {
    height: 50px;
    font-weight: bold;
    text-indent: 20px;
    font-size: 20px;
    font-size: 20px;
    display: flex;
    align-items: center;
  }

  .dv-charts-container {
    height: calc(~"100% - 50px");
  }
}
</style>
