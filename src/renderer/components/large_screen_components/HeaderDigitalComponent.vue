<template>
  <div id="digital-flop">
    <div
      class="digital-flop-item"
      v-for="item in digitalFlopData"
      :key="item.title"
      >
      <div class="digital-flop-title">{{ item.title }}</div>
      <div class="digital-flop">
        <dv-digital-flop
          :config="item.number"
          style="width:100px;height:50px;"
           />
          <div class="unit">{{ item.unit }}</div>
      </div>
    </div>

    <dv-decoration-10 />
  </div>
</template>

<script>
import {deepCopy} from "@/util/index.js";
export default {
  name: 'HeaderDigitalComponent',
  data () {
    return {
      digitalFlopData: [],
      mockAttackTime:0,
      mockAttackDefendTime:0,
      mockDigitalData:{
        "usefulBandwidth":{
          'title':'可用带宽容量',
          'number':0,
          'fill_color':'#4d99fc',
          'unit':'Mbps'
        },
        "avgDelay":{
          'title':'平均时延',
          'number':0,
          'fill_color':'#4d99fc',
          'unit':'ms'
        },
        "avgPktLossRate":{
          'title':'平均丢包率',
          'number':0,
          'fill_color':'#4d99fc',
          'unit':'%'
        }
      }
    }
  },
  watch:{
    '$store.state.environmentMonitor.headerDigitalData'(newVal,oldVal){
      // console.log("headerDigitalData:",newVal)
      if(newVal!=undefined)
        // this.updataData(this.genMockHeaderDigitalData())
        this.loopMockHeaderDigitalData()
    },
    '$store.state.environmentMonitor.taskHistoryData'(newVal,oldVal){
      console.log("taskHistoryData:",newVal)
      if(newVal!=undefined&&newVal.length>0){
        let latestTask = newVal[newVal.length-1]
        if(latestTask[2]=='攻击目标主机'){
          this.mockAttackTime = Number(latestTask[3])
        }
        if(latestTask[2]=='协议封禁'){
          this.mockAttackDefendTime = this.mockAttackTime+10 //攻击结束延迟10s释放防御
        }
      }
      this.loopMockHeaderDigitalData()
    }
  },
  created(){
    this.$nextTick(() => {
        let headerDigitalData = this.$store.getters.getHeaderDigitalData
        this.updataData(this.genMockHeaderDigitalData())
        setInterval(()=>{
          this.loopMockHeaderDigitalData()
        },2000)
    });
  },
  methods: {
    loopMockHeaderDigitalData(){
      //正常情况下的数据
      let mockDigitalData = this.mockDigitalData
      mockDigitalData['usefulBandwidth']['number'] = this.randomExtend(450,460)
      mockDigitalData['avgDelay']['number'] = this.randomExtend(10,20)
      mockDigitalData['avgPktLossRate']['number'] = this.randomExtend(99,100)
      //当攻击发生时
      if(this.mockAttackTime>0){
        mockDigitalData['usefulBandwidth']['number'] = this.randomExtend(300,350)
        mockDigitalData['avgDelay']['number'] = this.randomExtend(100,125)
        mockDigitalData['avgPktLossRate']['number'] = this.randomExtend(50,85)
        this.mockAttackTime -=1
      }
      //当攻击发生并且有防御时
      if(this.mockAttackTime>0&&this.mockAttackDefendTime>0){
        console.log('mockAttackTime:',this.mockAttackTime)
        console.log('mockAttackDefendTime:',this.mockAttackDefendTime)
        mockDigitalData['usefulBandwidth']['number'] = this.randomExtend(350,400)
        mockDigitalData['avgDelay']['number'] = this.randomExtend(15,25)
        mockDigitalData['avgPktLossRate']['number'] = this.randomExtend(90,95)
        this.mockAttackDefendTime-=1
      }
      this.mockDigitalData = deepCopy(mockDigitalData)
      this.updataData(this.genMockHeaderDigitalData())
    },
    genMockHeaderDigitalData(){
      let headerDigitalData = deepCopy(this.$store.getters.getHeaderDigitalData)
      let mockDigitalData = this.mockDigitalData
      Object.keys(mockDigitalData).forEach((key)=>{
        headerDigitalData[key]['number'] = mockDigitalData[key]['number']
      })
      return headerDigitalData
    },
    updataData (headerDigitalData) {
      let newDigitalFlopData = []
      Object.keys(headerDigitalData).forEach((key)=>{
        newDigitalFlopData.push({
          title: headerDigitalData[key]['title'],
          number: {
            number: [headerDigitalData[key]['number']],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: headerDigitalData[key]['fill_color'],
              fontWeight: 'bold'
            }
          },
          unit: headerDigitalData[key]['unit']
        })
      })
      this.digitalFlopData = newDigitalFlopData
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
#digital-flop {
  position: relative;
  height: 48%;
  margin-bottom:2%;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(6, 30, 93, 0.5);

  .dv-decoration-10 {
    position: absolute;
    width: 95%;
    left: 2.5%;
    height: 5px;
    bottom: 0px;
  }

  .digital-flop-item {
    width: 11%;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-left: 3px solid rgb(6, 30, 93);
    border-right: 3px solid rgb(6, 30, 93);
  }

  .digital-flop-title {
    font-size: 20px;
  }

  .digital-flop {
    display: flex;
  }

  .unit {
    margin-left: 10px;
    display: flex;
    align-items: flex-end;
    box-sizing: border-box;
    padding-bottom: 13px;
  }
}
</style>
