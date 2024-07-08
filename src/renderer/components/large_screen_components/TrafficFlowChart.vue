<template>
  <div id="traffic-chart">
    <!-- <div class="traffic-chart-title">流量峰值</div> -->
    <div class="dv-charts-container" id="trafficLineChart" style="width: 100%; height: 100%;" ></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: 'TrafficFlowChart',
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
      option: {}
    }
  },
  watch:{
    '$store.state.environmentMonitor.trafficFlowData'(newVal,oldVal){
      if(newVal!={})
        this.updataOptionData(this.proccessEnvDataToChartData(newVal))
    }
  },
  created() {
    this.$nextTick(() => {
      this.initLineChart()
      let trafficFlowData = this.$store.getters.getEnvironmentMonitorData['trafficFlowData']
      if(trafficFlowData!={})
        this.updataOptionData(this.proccessEnvDataToChartData(trafficFlowData))
    });
  },
  methods: {
    initLineChart() {
        console.log('初始化流量指标折线图')
        console.log("darkTheme:",this.darkTheme)
        this.lineChart = echarts.init(document.getElementById('trafficLineChart'),this.darkTheme?'dark':'');
    },
    proccessEnvDataToChartData(trafficFlowData) {
      let chartData = {
        'xAxis_data':trafficFlowData['timestamp_list'],
        'total_flow':{
          'series_data':trafficFlowData['total_flow_bytes']
        }
      }
      return chartData
    },
    calculateFlowUnit(flowNum) {
      //计算流单位(基础单位Bps)
      let unitList = ['Bps','KBps','MBps','GBps','TBps']
      let unitIndex = 0
      while(flowNum>1024){
        flowNum = flowNum/1024
        unitIndex++
      }
      return flowNum.toFixed(2)+' '+unitList[unitIndex]
    },
    updataOptionData (chartData) {
      this.option = {
        animation: this.animation, //是否动态显示(报告导出时该值设置为false)
        backgroundColor:'transparent',
        grid:{
          left: '1%',
          right: '5%',
          bottom: '10%',
          top: '20%',
          containLabel: true
        },
        title: {
          text: '流量峰值监控',
          subtext: '协议类型(Total,TCP,UDP,ICMP)'
        },
        tooltip: {
          trigger: 'axis',
          valueFormatter: (value) =>  this.calculateFlowUnit(value),
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
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
            formatter: (value) =>  this.calculateFlowUnit(value)
          },
          axisPointer: {
            snap: true
          }
        },
        legend: {
          data: ['Total','TCP', 'UDP', 'ICMP']
        },
        series: [
          {
            name: 'Total',
            //stack: 'Total',
            type: 'line',
            smooth: true,
            showSymbol: false,
            lineStyle:{
              color:'rgba(57, 134, 215, 0.807)'
            },
            areaStyle: {
              color:'rgba(57, 134, 215, 0.807)'
            },
            data: chartData['total_flow']['series_data']
          }

        ]
      }
      if(this.lineChart!=null)
        this.lineChart.setOption(this.option,true)
    }
  },
  mounted () {
  }
}
</script>

<style lang="less">
#traffic-chart {
  width: 100%;
  height: 100%;
  background-color: rgba(6, 30, 93, 0.5);
  border-top: 2px solid rgba(1, 153, 209, .5);
  box-sizing: border-box;
  margin-right: 10px;
  .traffic-chart-title {
    height: 50px;
    font-weight: bold;
    text-indent: 20px;
    font-size: 20px;
    display: flex;
    align-items: center;
  }

  .dv-charts-container {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    // height: calc(~"100% - 50px");
  }
}
</style>
