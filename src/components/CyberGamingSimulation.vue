<template>
  <div class="cyberGamingSimulationPage">
     <div ref="leftBox"  class="left-box">
        <AttackerComponent> </AttackerComponent>
     </div>
     <div class="center-box">
        <div class="center-top-box"> 
          <NetworkTopo></NetworkTopo>
        </div>
        <div class="center-bottom-box">
          <div class="console-content">
              <div v-for="item in consoleContent" v-key="index">
                <div>{{item.timestamp}}:{{item.msg}}</div>
              </div>
          </div>
        </div>
     </div>
     <div class="right-box">
      <DefenderComponent></DefenderComponent>
     </div>
  </div>
</template>

<script>
import networkTopo from './network_components/NetworkTopo.vue'
import AttackerComponent from './cyber_gaming_simulation/AttackerComponent.vue'
import DefenderComponent from './cyber_gaming_simulation/DefenderComponent.vue'
export default {
  name: 'CyberGamingSimulationPage',
  components: {
    NetworkTopo:networkTopo,
    AttackerComponent:AttackerComponent,
    DefenderComponent:DefenderComponent
  },
  data() {
    return {
      consoleContent:[]
    }
  },
  watch:{
    '$store.state.global.message'(newVal,oldVal){
      this.consoleOutput(newVal['message'])
      //this.$mesaage.info(newVal['message'])
    }
  },
  mounted() {
  },
  created() {
    this.consoleOutput("启动控制台");
  },
  methods: {
    consoleOutput(msg) {
      let msgOut = {
        timestamp: new Date().toLocaleString(),
        msg: msg
      }
      var consoleContent =  this.consoleContent
      consoleContent.push(msgOut)
      console.log(consoleContent)
      this.consoleContent=consoleContent;
    },
    clearConsole() {
      this.consoleContent = []
    },
    onLeftBoxHover(e){
      let leftBoxWidth = this.$refs.leftBox.offsetWidth
      let currentMouseOffsetX=e.offsetX
      let borderMargin = leftBoxWidth-currentMouseOffsetX
      console.log("borderMargin:"+borderMargin)
      if(Math.abs(borderMargin)<10){
        console.log("leftBoxWidth:"+leftBoxWidth)
        console.log(e)
        // 或者只为特定元素设置鼠标样式
       e.target.style.cursor = 'w-resize';
      }
      else{
        e.target.style.cursor = '';
      }
      
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cyberGamingSimulationPage{
  width: 100%;
  height: 100%;
  min-height: 610px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+ */
  user-select: none; /* Standard syntax */
}
.cyberGamingSimulationPage .left-box{
  width: 25%;
  height: 100%;
  
}
.cyberGamingSimulationPage .center-box{
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  border: 1px rgba(217, 216, 216, 0.578) solid;
}
.center-box .center-top-box{
  width: 100%;
  height:80%;
}
.center-box .center-bottom-box{
  width: 100%;
  height: 16%;
  text-align: left;
  background-color: #9cc0ef;
  color: white;
  border-top:1px rgba(217, 216, 216, 0.578) solid;
  padding: 5px;
}
.cyberGamingSimulationPage .right-box{
  width: 25%;
  height: 100%;
}

</style>
