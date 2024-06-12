<template>
    <div class="reportTemplate">
      <div class="report-header">
        <div class="report-title">{{report.title}}</div>
        <div class="report-create-time">{{report.create_time}}</div>
        <div class="report-description">{{report.description}}</div>
      </div>
      <div class="report-body">
        <div class="report-item" v-for="(item,index) in report.report_data" :key="index"">
          <div class="report-item-title">{{item.title}}</div>
          <div class="report-item-description">{{item.description}}</div>
          <div class="report-item-table" v-if="item.has_table" v-for="(table,t_index) in item.table_data">
            <table class="report-item-table-body">
              <tr>
                <th v-for="(name,k_index) in table.keys">{{ name }}</th>
              </tr>
              <tr v-for="(values,d_index) in table.data">
                <td v-for="(value,v_index) in values">{{value}}</td>
              </tr>
            </table>
            <div class="report-item-table-title">{{table.title}}</div>
          </div>
          <div class="report-item-chart" v-if="item.has_chart" v-for="(chart,c_index) in item.chart_data">
            <div class="report-item-chart-body">
               <img :src="chart.chart_base64_content">
            </div>
            <div class="report-item-chart-title">{{chart.chart_title}}</div>
          </div>
        </div>
      </div>
    </div>
</template>
  
<script>
import generate_report_data from '@/controller/reportManager.js'
export default {
  name: 'ReportPdfTemplate',
  components: {
      
  },
  data() {
    return {
      report:{}
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
    getReportData(){
      let report = generate_report_data()
      this.report = report
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
  
  .reportTemplate{
    width: 100%;
    height: 100%;
    min-height: 610px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
  
  }
  .reportTemplate .header-box{
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
  
  .reportTemplate .body-box{
    background-color: white;
    height: 100%;
    width: 100%;
  }
  </style>
  