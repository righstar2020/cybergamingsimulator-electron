<template>
  <div class="LineChartComponent">
      <div id="DDoSAttackLineChart" style="width: 600px; height: 400px;" >
      </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import {deepCopy,formatTimestamp} from "@/util/index.js";
import {formatTimestampToMinutesSeconds} from '@/util'
export default {
  name: 'DDoSAttackLineChart',
  props: { 
    taskData:{
      type:Object,
      default:{}
    },
  },
  watch:{
    'taskData'(newVal,oldVal){
       let  newLineChartData = this.proccessTaskData(newVal)
      this.updateLineChart(newLineChartData)
    }
  },
  data() {
    return {
      defaultEchartOption:{},
      lineChart:null,
      lineChartData:{
        chartId:'DDoSAttackLineChart',
        title:'DDoS攻击次数',
        xAxisData: ['round 1', 'round 2', 'round 3', 'round 4', 'round 5', 'round 6', 'round 7'],
        yAxisData: [],
        yAxisLabel:{},
        legendData: ['10.0.0.1', '10.0.0.2', '10.0.0.3'],
        seriesData: [{
          name:'10.0.0.1',
          data:[0,0,0,0,0,0]
        }]
      },
      lineChartOption:{
        title: {
          text: 'no data'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: []
        },
        grid: {
              show: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [],
          axisLine: {
              //y轴线的配置
              show: true, //是否展示
              lineStyle: {
                color: 'black', //y轴线的颜色（若只设置了y轴线的颜色，未设置y轴文字的颜色，则y轴文字会默认跟设置的y轴线颜色一致）
                width: 1, //y轴线的宽度
                type: 'solid' //y轴线为实线
              }
          },
          // 添加x轴标签样式配置
          axisLabel: {
            color: 'gray', // 文字颜色
            fontSize: 12, // 文字大小
            rotate: 0, // 文字旋转角度
            interval: 0, // 是否间隔显示标签，0表示全部显示
          }
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
          // 添加y轴标签样式配置
          axisLabel: {
              color: 'gray', // 文字颜色
              fontSize: 12, // 文字大小
              formatter: '{value} ms', // 自定义格式化显示文本，例如将数值单位设为ms
          }
        },
        series: [  ]
      }
    }
  },
  mounted() {
    
  },
  created() {
    this.$nextTick(()=>{
      //mountd阶段才能获取到dom
      this.initLineChart()
      if(this.taskData!={}){
        let newLineChartData = this.proccessTaskData(this.taskData)
        this.updateLineChart(newLineChartData)
      }
      
    })
  },
  methods:{
    initLineChart() {
      console.log('初始化折线图')
      this.lineChart = echarts.init(document.getElementById(this.lineChartData.chartId));
      if(this.lineChartOption!=null){
        this.lineChart.setOption(this.lineChartOption)
      }
    },
    proccessTaskData(envStatusResult){
        let envStatusResultDataList = envStatusResult['envStatusResultDataList']
        if(envStatusResultDataList == undefined){
          console.log("proccess chart data:no data")
          return
        }
        console.log("proccess chart data:")
        console.log(envStatusResultDataList)
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
          chartId:'DDoSAttackLineChart',
          title:'DDoS攻击',
          xAxisData: xAxisData,
          yAxisData: [],
          yAxisLabel:{},
          legendData: legendData,
          seriesData: seriesData
        }
        this.chartData = lineChartData
        return lineChartData
    },
    updateLineChart(newLineChartData) {
      if(this.lineChart == null){
        this.initLineChart()
      }
      //更新折线图
      let newLineChartOption = this.lineChartOption
      //更新title
      newLineChartOption['title']['text'] = newLineChartData.title
      //更新legend
      newLineChartOption['legend']['data'] = newLineChartData.legendData
      newLineChartOption['series']=[]
      if(newLineChartData!=null){
         newLineChartOption.xAxis.data=newLineChartData.xAxisData;
      }
      //更新线数据
      console.log("newLineChartOption.seriesData:")
      console.log(newLineChartData)
      for(let i = 0;i<newLineChartData.seriesData.length;i++){
        let newSeriesDataItem = {
          name:newLineChartData.seriesData[i].name,
          data:newLineChartData.seriesData[i].data,
          type:'line',
          stack:'Total'
        }
        newLineChartOption['series'].push(newSeriesDataItem)
      }
       
      this.lineChart.setOption(newLineChartOption,true)
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.LineChartComponent{
  width: 100%;
}
</style>
