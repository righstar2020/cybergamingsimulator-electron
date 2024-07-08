<template>
  <div class="EchartToBase64">
    <div :id="chartId" :style="{ width: '500px', height: '252px' }"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'EchartToBase64',
  components: {
  },
  props: { 
    chartId:{
      type: String, //父组件传参
      default: 'myChart'
    },
    option:{
      type: Object, //父组件传参
      default: null
    }
  },
  data() {
    return {
      myChart:null
    }
  },
  watch:{
  },
  created() {
    this.$nextTick(()=>{
      this.initEchart(this.option)
    })
  },
  mounted() {
  },
  
  methods: {
    updateByOption(option) {
      if (option !=null) {
        option['animation'] = false
        if(this.myChart!=null)
          this.myChart.setOption(option)
      }
      
    },
    initEchart(option) {
      const dom = document.getElementById(this.chartId)
      const myChart = echarts.init(dom) // 初始化echarts实例
      if(option!=null){
        myChart.setOption(option)
        this.myChart = myChart
        return 
      }
      option = {
          animation: false, // 该属性必须加，不然转换后的base64达不到图表的效果
          xAxis: {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
              type: 'value'
          },
          series: [
              {
                  name: 934,
                  data: [820, 932, 901, 934, 1290, 1330, 1320],
                  type: 'line',
                  smooth: true,
                  markPoint: { // 凸显选中值
                      data: [
                          {
                              yAxis: '932',
                              xAxis: 'Tue',
                              value: '932',
                              color: 'red',
                              itemStyle:
                              {
                                  color: 'red'

                              }

                          } // 这种写法时可以凸显某些能确定在坐标轴上大概位置的数据，value为要凸显的内容
                      ]
                  }
              }
          ]
      }
      // 设置实例参数
      myChart.setOption(option)
      this.myChart = myChart
    },
    outputBase64() {
      // 获取图片
      const dom = document.getElementById(this.chartId)
      if (dom !== null) {
        dom_echart = echarts.getInstanceByDom(dom)
      }
      base64Str = dom_echart.getDataURL({
          type: 'png',
          pixelRatio: 2, //导出的图片分辨率比例，默认为 1
          // 导出的图片背景色，默认使用 option 里的 backgroundColor
          backgroundColor: '#fff'
        // 忽略组件的列表，例如要忽略 toolbox 就是 ['toolbox']
        //  excludeComponents: Array.<string>
      })
      return base64Str
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
html,body{
  background-color: transparent;
  width: 100%;
  height: 100%;
}

</style>
