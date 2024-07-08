<template>
  <div id="traffic-entropy-chart">
    <!-- <div class="traffic-entropy-chart-title">流量熵</div> -->
    <div class="dv-charts-container" id="trafficEntropyLineChart" style="width: 100%; height: 100%;" ></div>
  </div>
</template>

<script>
import {deepCopy} from "@/util/index.js";
import * as echarts from "echarts";
export default {
  name: 'TrafficEntropyChart',
  props: { 
    animation:{
      type:Boolean,
      default:true
    },
    darkTheme:{
      type:Boolean,
      default:true
    },
  },
  data () {
    return {
      option: {},
      lineChart:{}
    }
  },
  watch:{
    '$store.state.environmentMonitor.trafficEntropyData'(newVal,oldVal){
      if(newVal!=undefined)
        this.updataOptionData(this.proccessEnvDataToChartData(newVal))
    }
  },
  created() {
    this.$nextTick(() => {
      this.initLineChart()
      let trafficEntropyData = this.$store.getters.getEnvironmentMonitorData['trafficEntropyData']
      if(trafficEntropyData!=undefined)
        this.updataOptionData(this.proccessEnvDataToChartData(trafficEntropyData))
    });
  },
  methods: {
    initLineChart() {
        console.log('初始化流量熵折线图')
        this.lineChart = echarts.init(document.getElementById('trafficEntropyLineChart'),this.darkTheme?'dark':'');
    },
    proccessEnvDataToChartData(trafficEntropyData) {
      console.log("trafficEntropyData:",trafficEntropyData)
      let chartData = {
        'xAxis_data':trafficEntropyData['timestamp'],
        'source_ips_entropy':{
          'series_data':trafficEntropyData['source_ips_entropy']
        },
        'destination_ports_entropy':{
          'series_data':trafficEntropyData['destination_ports_entropy']
        }
      }
      return chartData
    },
    updataOptionData (chartData) {
      let option  = {
            animation: this.animation, //是否动态显示(报告导出时该值设置为false)
            backgroundColor:'',
            title: {
              text: '流量熵监控',
              subtext: '类型(源IP熵,目的端口熵)'
            },
            tooltip: {
              trigger: 'axis',
              valueFormatter: (value) =>  value.toFixed(2),
              axisPointer: {
                type: 'cross'
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              // prettier-ignore
              data: chartData['xAxis_data']
            },
            yAxis: {
              type: 'value',
              axisLine: {
                  //y轴线的配置
                  show: true, //是否展示
                  lineStyle: {
                    color: 'black', //y轴线的颜色（若只设置了y轴线的颜色，未设置y轴文字的颜色，则y轴文字会默认跟设置的y轴线颜色一致）
                    width: 1, //y轴线的宽度
                    type: 'solid' //y轴线为实线
                  }
              },
              axisLabel: {
                formatter: '{value}'
              },
              axisPointer: {
                snap: true
              }
            },
            // 更改图例默认颜色(依次应用)
            color:['rgba(57, 134, 215, 0.807)', 'rgba(243, 71, 14, 0.886)'],
            legend: {
              data: ['源IP熵','目的端口熵']
            },
            series: [
              {
                name: '源IP熵',
                //stack: 'Total',
                type: 'line',
                smooth: true,
                showSymbol: false,
                lineStyle:{
                  color:'rgba(57, 134, 215, 0.807)'
                },
                data:chartData['source_ips_entropy']['series_data']
              },
              {
                name: '目的端口熵',
                //stack: 'Total',
                type: 'line',
                smooth: true,
                showSymbol: false,
                lineStyle:{
                    color:'rgba(243, 71, 14, 0.886)'
                },
                data: chartData['destination_ports_entropy']['series_data']
              }

            ]
          };
      this.option = option;
      this.lineChart.setOption(option);
    },
    randomExtend (minNum, maxNum) {
      if (arguments.length === 1) {
        return parseInt(Math.random() * minNum + 1, 10)
      } else {
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
      }
    }
  },
  mounted () {

  }
}
</script>

<style lang="less">
#traffic-entropy-chart {
  width: 100%;
  height: 100%;
  background-color: rgba(6, 30, 93, 0.5);
  border-top: 2px solid rgba(1, 153, 209, .5);
  box-sizing: border-box;

  .traffic-entropy-chart-title {
    height: 50px;
    font-weight: bold;
    text-indent: 20px;
    font-size: 20px;
    font-size: 20px;
    display: flex;
    align-items: center;
  }

  .dv-charts-container {
    padding-top: 20px;
    padding-left: 10px;
    height: 100%;
    // height: calc(~"100% - 50px");
  }
}
</style>
