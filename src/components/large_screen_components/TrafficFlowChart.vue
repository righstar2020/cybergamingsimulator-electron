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
  data () {
    return {
      option: {}
    }
  },created() {
    setTimeout(() => {
      this.createData()
      this.drawLineChart()
    }, 100);
    
  },
  methods: {
    drawLineChart() {
        console.log('初始化折线图')
        console.log(this.option)
        console.log(document.getElementById('trafficLineChart'))
        this.lineChart = echarts.init(document.getElementById('trafficLineChart'),'dark');
        this.lineChart.setOption(this.option)
    },
    createData () {
      const { randomExtend } = this

      this.option = {
        backgroundColor:'',
        title: {
          text: '流量峰值监控',
          subtext: '协议类型(TCP,UDP,ICMP)'
        },
        tooltip: {
          trigger: 'axis',
          valueFormatter: (value) =>  value.toFixed(2)+'bps',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          // prettier-ignore
          data: ['00:00', '01:15', '02:30', '03:45', '05:00', '06:15', '07:30', '08:45', '10:00', '11:15', '12:30', '13:45', '15:00', '16:15', '17:30', '18:45', '20:00', '21:15', '22:30', '23:45']
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
        legend: {
          data: ['TCP', 'UDP', 'ICMP']
        },
        series: [
          {
            name: 'TCP',
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
            data: [300, 280, 250, 260, 270, 300, 550, 500, 400, 390, 380, 390, 400, 500, 600, 750, 800, 700, 600, 400],
            
          }

  ]
}
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
    const { createData } = this

    createData()

    setInterval(createData, 30000)
  }
}
</script>

<style lang="less">
#traffic-chart {
  width: 90%;
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
    font-size: 20px;
    display: flex;
    align-items: center;
  }

  .dv-charts-container {
    padding-top: 20px;
    padding-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%
    // height: calc(~"100% - 50px");
  }
}
</style>
