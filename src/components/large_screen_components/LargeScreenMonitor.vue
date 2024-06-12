<template>
  <div class="largeScreenMonitor" >
    <dv-full-screen-container>
      <div class="header-box" >
        <headerComponent/>
        <headerDigitalComponent/>
      </div>
      <div class="body-box">
          <div class="body-left-box">
              <trafficFlowChart/>
          </div>
          <div class="body-center-box">
              <networkDynamicFlyMap/>
          </div>
          <div class="body-right-box">
              <bodyScrollBoard/>
          </div>
      </div>
      <div class="bottom-box">
        <div class="bottom-left-box">
              <operationsRankingBoard/>
        </div>
          <div class="bottom-center-box">
              <trafficEntropyChart/>
          </div>
          <div class="bottom-right-box">
              <div class="right-box-1">
                <envStatusCards/>
              </div>
              <div class="right-box-2">
                <protocolPieChart/>
              </div>
          </div>
      </div>
    </dv-full-screen-container>
     
  </div>
</template>

<script>
import headerComponent from './HeaderComponent.vue'
import headerDigitalComponent from './HeaderDigitalComponent.vue'
import trafficFlowChart from './TrafficFlowChart.vue'
import networkDynamicFlyMap from './NetworkDynamicFlyMap.vue'
import bodyScrollBoard from './BodyScrollBoard.vue'
import operationsRankingBoard from './OperationsRankingBoard.vue'
import trafficEntropyChart from './TrafficEntropyChart.vue'
import envStatusCards from './EnvStatusCards.vue'
import protocolPieChart from './ProtocolPieChart.vue'

export default {
  name: 'CyberGamingSimulationPage',
  components: {
    headerComponent,
    headerDigitalComponent,
    trafficFlowChart,
    networkDynamicFlyMap,
    bodyScrollBoard,
    operationsRankingBoard,
    trafficEntropyChart,
    envStatusCards,
    protocolPieChart,
  },
  data() {
    return {
      consoleContent:[]
    }
  },
  watch:{
    '$store.state.global.message'(newVal,oldVal){
      
    }
  },
  mounted() {
  },
  created() {
    
  },
  methods: {
    
    
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,body{
  background-color: transparent;
  width: 100%;
  height: 100%;
  /* 禁用html的滚动条，因为用的无框架窗口，默认就会有一个滚动条，所以去掉 */
  overflow-y: hidden;
  overflow-x: hidden;
}
.largeScreenMonitor{
  width: 100%;
  height: 100%;
  background-color: #030409;
  color: #fff;
}
#dv-full-screen-container {
    height:100%;
    width: 100%;
    background-image: url('@/assets/large_screen_bg.png');
    background-size: 100% 100%;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
}
/*头部*/
.largeScreenMonitor .header-box{
  height: 22%;
  width: 100%;
}
/*中部*/
.largeScreenMonitor .body-box{
  height: 45%;
  width: 100%;
  display:flex;
  align-items: center;
  justify-content:flex-start;
  margin-bottom: 10px
}
.body-box .body-left-box{
  height: 100%;
  width: 29%;
  margin-right: 10px;
}
.body-box .body-center-box{
  height: 100%;
  width: 29%;
  margin-right: 10px;
}
.body-box .body-right-box{
  height: 100%;
  width: 40%;
}
/*底部*/
.largeScreenMonitor .bottom-box{
  height: 30%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.bottom-box .bottom-left-box{
  height: 100%;
  width: 29%;
  margin-right: 10px;
}
.bottom-box .bottom-center-box{
  height: 100%;
  width:29%;
  margin-right: 10px;
}
.bottom-box .bottom-right-box{
  height: 100%;
  width:40%;
  display: flex;
  align-items: center;
  justify-content: flex-start
}
.bottom-right-box .right-box-1{
  height: 100%;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-right: 10px;
}
.bottom-right-box .right-box-2{
  height: 100%;
  width: 48%;
}
</style>
