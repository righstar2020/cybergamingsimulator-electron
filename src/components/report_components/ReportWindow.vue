<template>
  <div class="reportWindow">
      <div class="header-box">

      </div>
     <div class="body-box">
      <reportPdfTemplate/>
     </div>
  </div>
</template>

<script>
import reportPdfTemplate from './ReportPdfTemplate.vue'
export default {
  name: 'CyberGamingSimulationPage',
  components: {
    reportPdfTemplate
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
<style >
html,body{
  background-color: transparent;
  width: 100%;
  height: 100%;
}

.reportWindow{
  width: 100%;
  height: 100%;
  min-height: 610px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;

}
.reportWindow .header-box{
  width: 100%;
  height: 30px;
  background-color: #9cc0ef;;
  border-radius: 5px 5px 0 0;
  box-shadow: 1px 2px 1px gainsboro;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 10px;
  font-size: 20px;
}
.header-box .window-close:hover{
  cursor: pointer;
}

.reportWindow .body-box{
  background-color: white;
  height: 100%;
  width: 100%;
}
</style>
