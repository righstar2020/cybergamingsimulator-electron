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


}


.reportWindow .body-box{
  background-color: white;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center
}
</style>
