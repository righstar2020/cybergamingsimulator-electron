<template>
  <div class="AttackerComponent">
    <el-tabs class="tabs" type="border-card">
          <el-tab-pane label="攻击选择">
            <div class="tab-content-box" id="attacker-select-tab">
              <div class="attacker-statistic-info">
                  <el-row >
                    <el-col :span="8">
                      <el-statistic title="对抗轮次" :value="currentGameRoundNum" />
                    </el-col>
                    <el-col :span="8">
                      <el-statistic title="执行操作数" :value="currentOperationNum" />
                    </el-col>
                    <el-col :span="8">
                      <el-statistic title="攻击成功数" :value="currentSuccesssAttackNum" />
                    </el-col>
                 </el-row>
              </div>
              <el-scrollbar height="600px">
              <div class="attacker-operations-select-box">
                <el-segmented v-model="currentAttackOperationTypeTab" :options="attackOperationTypeTabs" />
                  <div class="attacker-operations-info-box">
                    <div class="attacker-operations-info">
                      <el-collapse class="attacker-operations-info-collapse" v-model="activeAttackerOperatonInfo" accordion>
                        <el-collapse-item v-if="currentAttackOperationTypeTab=='信号'" v-for="(item,index) in attackerSignalOperationsList" v-key="index" :title="item.title" :name="item.title" class="attacker-operations-info-item" >
                          <div class="operation-info-setup"  v-html="formattedText(item.description)">
                          </div>
                           <div class="operation-add">
                            <el-button type="primary" @click="openAttackerOperationForm(currentAttackOperationTypeTab,index)">添加</el-button>
                           </div>
                        </el-collapse-item>
                        <el-collapse-item v-if="currentAttackOperationTypeTab=='动作'" v-for="(item,index) in attackerActionOperationsList" v-key="index" :title="item.title" :name="item.title" class="attacker-operations-info-item" >
                          <div class="operation-info-setup" v-html="formattedText(item.description)">
                          </div>
                           <div class="operation-add">
                            <el-button type="primary" @click="openAttackerOperationForm(currentAttackOperationTypeTab,index)">添加</el-button>
                           </div>
                        </el-collapse-item>
                    </el-collapse>
                    </div>
                  </div>
                  <div class="attacker-operations-selected" >
                    <el-table :data="currentAttackerSelectedOperationLinkData" style="width: 100%;text-align: left;"  >
                      <el-table-column  prop="id" label="id" width="40" />
                      <el-table-column  prop="operationType" label="type" width="60" >
                        <template #default="scope_type">
                              <el-tag>{{ scope_type.row.operationType  }}</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column  prop="name" label="name" width="120" >
                        <template #default="scope_1">
                          <el-popover effect="light" trigger="hover" placement="top" width="auto">
                            <template #default>
                              <div>操作名: {{ scope_1.row.title }}</div>
                              <div v-for="(item,index) in scope_1.row.params">
                                {{ item.title }}: {{ item.value }}
                              </div>
                            </template>
                            <template #reference>
                              <el-tag>{{ scope_1.row.title  }}</el-tag>
                            </template>
                          </el-popover>
                        </template>
                      </el-table-column>
                      <el-table-column fixed="right" label="操作" width="140" >
                        <template #default="scope_2" >
                            <el-popover placement="right" width="auto" trigger="click">
                            <template #reference>
                              <el-button type="primary" size="small" @click="editAttackerSelectedOperation(scope_2.$index)" >修改</el-button>
                            </template>
                            <div v-for="editOperation  in currentEditOperationData">
                              <el-table :data="currentEditOperationData">
                                <el-table-column width="70" property="id" label="id" />
                                <el-table-column width="100" property="title" label="name" />
                                <el-table-column v-for="(item,index) in editOperation.params"  property="params" :label="item.title">
                                <template #default="edit_scope_1">
                                  {{ item.value }}
                                </template>
                                </el-table-column>
                              </el-table>
                            </div>
                            <el-button style="margin-top: 10px;"   type="primary" size="small"  @click="saveEditedAttackerSelectedOperation(scope_2.$index)">
                              保存
                            </el-button>
                          </el-popover>
                          <el-button type="danger"  size="small" @click="deleteAttackerSelected(scope_2.$index)">
                              删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                  <el-button 
                     style="margin-top: 8px;margin-bottom: 10px;" 
                      type="primary" 
                      size="small" 
                      @click="runAttackerOperationsLink"
                     >
                    执行操作链
                  </el-button>
              </div>
              <div class="attacker-operations-history">
                  <el-timeline style=" max-width: 220px">
                    <el-timeline-item
                        v-for="(item,index) in attackerOperationsHistory"
                        :key="index"
                        :timestamp="item.timestamp"
                        :color="item.status=='success'?'#0bbd87':''"
                        size="large"
                      >
                        <div class="attacker-operation-history-view">

                          {{ item.title }}
                          <el-button type="primary" size="small" @click="viewOperationHistoryDetail(index)" >详情</el-button>
                        </div>
                      </el-timeline-item>
                  </el-timeline>
                  <el-button 
                     style="margin-top: 8px;margin-bottom: 10px;align-items: center;" 
                      type="primary" 
                      size="small" 
                      @click="openReportWindow"
                     >
                    导出报告
                  </el-button>
              </div>
            </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane label="环境状态">
            <div class="tab-content-box" id="attacker-env-status-tab">
              <AttackerEnvStatusComponent></AttackerEnvStatusComponent>
            </div>
          </el-tab-pane>
          <el-tab-pane label="攻击配置">
            <div class="tab-content-box" id="attacker-config-tab">
              <AttackerConfigComponent></AttackerConfigComponent>
            </div>
          </el-tab-pane>
      </el-tabs>
      <!--全局对话框-->
      <!--attacker operation select-->
      <el-dialog v-model="attackerOperationFormVisible" 
          :modal="false" 
          :close-on-click-modal="false"
          title="攻击者操作选择"
          width="400" 
          modal-class="dialog_class"
          draggable
          append-to-body
          >
        <el-form :model="attackerOperationForm.params">
          <el-form-item v-for="(param,index) in attackerOperationForm.params" :label="param.title" label-width="100">
            <el-select v-if="param.formType=='select'" v-model="attackerOperationForm.params[index].value" >
            </el-select>
            <el-input v-if="param.formType=='input'" v-model="attackerOperationForm.params[index].value" autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="attackerOperationFormVisible = false">取消</el-button>
            <el-button type="primary" @click="saveAttackerOperationForm">
              确认
            </el-button>
          </div>
        </template>
      </el-dialog>
      <!--历史操作详情-->
      <el-dialog v-model="historyOperationDetailVisible" 
          title="历史操作"
          width="700"
          :modal="false" 
          :close-on-click-modal="false"
          modal-class="dialog_class"
          draggable
          append-to-body
       >
          <el-table :data="attackerOperationsHistoryDetail.operationLink">
            <el-table-column width="100" property="id" label="id" />
            <el-table-column width="100" property="task_id" label="task_id" />
            <el-table-column width="100" property="title" label="name" />
            <el-table-column width="100" property="status" label="状态" >
              <template #default="scope_status">
                <el-tag>{{ scope_status.row.status  }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column width="120" v-for="(item,index) in attackerOperationsHistoryDetail.operationLinkParamsName"  :property="item.name" :label="item.title">
            </el-table-column>
            <el-table-column fixed="right" width="140" property="result" label="结果" >
              <template #default="scope_result" >
                <el-button type="primary" size="small"  @click="viewOparationResult">
                    查看结果
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <template #footer>
          <div class="dialog-footer">
            <el-button @click="historyOperationDetailVisible = false">取消</el-button>
            <el-button type="primary" @click="outputOperationLinkReport">
              导出报告
            </el-button>
          </div>
        </template>
      </el-dialog>
  </div>
</template>

<script>
import {generateMD5TimestampId} from "@/util/crypto.js"
import {proccess_operation_link_to_task} from "@/task/proccess_task.js"
import {deepCopy} from "@/util/index.js";
import AttackerEnvStatusComponent from "./AttackerEnvStatusComponent.vue";
import AttackerConfigComponent from "./AttackerConfigComponent.vue";
export default {
  name: 'AttackerComponent',
  components:{
    AttackerEnvStatusComponent:AttackerEnvStatusComponent,
    AttackerConfigComponent:AttackerConfigComponent
  },
  data(){
    return {
      dialogStyle:'z-index:0',
      currentGameRoundNum:0,
      currentOperationNum:0,
      currentSuccesssAttackNum:0,
      currentAttackOperationTypeTab:'信号',
      attackOperationTypeTabs:['信号','动作'],
      activeAttackerOperatonInfo:'',
      attackerSignalOperationsList:[], //从全局state中加载
      attackerActionOperationsList:[],
      editOperationVisible:true,
      currentEditOperationData:[],
      attackerOperationFormVisible:false,
      attackerOperationForm:{},
      currentAttackerSelectedOperationLinkData:[],
      currentRunningOperationLink:[],
      attackerOperationsHistory:[],
      historyOperationDetailVisible:false,
      attackerOperationsHistoryDetail:{}   
    }
  },
  watch:{
    '$store.state.global.currentCopyFormData'(newVal,oldVal){
        //formData有更新并且正在输入时复制相应的数据
      let attackerOperationFormParams = this.attackerOperationForm.params
      console.log("值发生变化:"+newVal)
      if(this.attackerOperationFormVisible){
        Object.keys(newVal).forEach((key)=>{
          for(let i =0;i<attackerOperationFormParams.length;i++){
            if(attackerOperationFormParams[i].name==key){
              //找到相应主键则赋值
              if(newVal[key]!=null){
                attackerOperationFormParams[i].value = newVal[key]
              }
            }
          }
        })
        this.attackerOperationForm.params=attackerOperationFormParams
      }
    },
    '$store.state.attacker.historyOperation'(newVal,oldVal){
      if(newVal.length>0){
        this.attackerOperationsHistory = newVal
        this.$message.info('操作执行更新')
      }
    }
    
  },
  mounted(){
    //获取全局state数据
    let attackerActionOperation = this.$store.getters.getAttackerBaseOperation
    if(attackerActionOperation!=null){
        this.attackerSignalOperationsList = attackerActionOperation.signal
        this.attackerActionOperationsList = attackerActionOperation.action
    }
  },
  methods: {
    formattedText(text) {
      // 使用replace将\n替换为<br>以在HTML中创建换行
      console.log(text)
      return text.replace(/\n/g, '<br>');
    },
    openAttackerOperationForm(operationType,index){
      this.attackerOperationFormVisible = true
      console.log(operationType,index)
      if(operationType=='信号'){
        this.attackerOperationForm=this.attackerSignalOperationsList[index]
      }
      if(operationType=='动作'){
        this.attackerOperationForm=this.attackerActionOperationsList[index]
      }
    },
    checkFormInput(formData){
      //检查输入是否正确
      let check  = true
      if(formData.params.length>0){
        formData.params.forEach((param)=>{
          if(param.value==null||param.value==''){
            this.$message({
                message: '参数不能为空',
                type:'info'
            })
            check = false
          }
        })
      }else{
        check = false
      }
      return check
    },
    saveAttackerOperationForm(){
      this.attackerOperationFormVisible = false
      //保存操作输入
      let attackerOperationForm = deepCopy(this.attackerOperationForm)
      //生成操作ID
      let currentAttackerSelectedOperationLinkData=this.currentAttackerSelectedOperationLinkData
      let id = generateMD5TimestampId(this.currentAttackerSelectedOperationLinkData.length)
      attackerOperationForm['id']=id
      if(attackerOperationForm!=null){
        if(this.checkFormInput(attackerOperationForm)){
          console.log(attackerOperationForm)
          this.currentAttackerSelectedOperationLinkData.push(attackerOperationForm)
        }
      }
    },
    editAttackerSelectedOperation(index){
      let currentSelectedOperation = this.currentAttackerSelectedOperationLinkData[index]
      let currentEditOperationData = []
      currentEditOperationData.push(currentSelectedOperation)
      this.currentEditOperationData=currentEditOperationData
      console.log(currentSelectedOperation)
    },
    saveEditedAttackerSelectedOperation(index){
      this.editOperationVisible=false
    },
    deleteAttackerSelected(index){
      if(index<this.currentAttackerSelectedOperationLinkData.length)
        this.currentAttackerSelectedOperationLinkData.splice(index,1)
    },
    runAttackerOperationsLink(){
      let currentOperationLinkList = deepCopy(this.currentAttackerSelectedOperationLinkData)
      let operationLinkParams={}
      if(currentOperationLinkList.length==0){
        this.$message.info("无可执行的操作")
        return
      }
      //运行状态赋值,并复制param参数
      currentOperationLinkList.forEach(item=>{
        item.status = "running"
        let copyItem = deepCopy(item)
        for(let i =0;i<item.params.length;i++){
          operationLinkParams[copyItem.params[i].name]=copyItem.params[i].title
          item[copyItem.params[i].name]=copyItem.params[i].value
        }
      })
      let operationLinkParamsName = []
      Object.keys(operationLinkParams).forEach(key=>{
        operationLinkParamsName.push({
          name:key,
          title:operationLinkParams[key],
        })
      })
      //生成相应的操作链
      let operationLink = []
      let timestamp = new Date().toLocaleString()
      let operationLinkId=generateMD5TimestampId(this.attackerOperationsHistory.length)
      let operationLinkData = {
        operationLinkId:operationLinkId,
        title:currentOperationLinkList[0].title+'等操作',
        timestamp:timestamp,
        status:'running',
        operationLinkParamsName:operationLinkParamsName,
        operationLink:currentOperationLinkList
      }
      this.$store.commit('addAttackerHistoryOperation',operationLinkData)
      this.attackerOperationsHistory.push(operationLinkData)
      this.currentAttackerSelectedOperationLinkData=[]
      //远端执行操作链
      proccess_operation_link_to_task('attacker',operationLinkId,currentOperationLinkList)

    },
    openReportWindow(){
        const data = {
            title: '生成报告',
            url: 'reportWindow'
        };
        //创建新监控窗口
        this.$electron.ipcRenderer.send('open-frameless-window-by-local-url', data);
        console.log(this.$electron)
    },
    viewOperationHistoryDetail(index){
      let operationHistoryDetail = this.attackerOperationsHistory[index]
      this.attackerOperationsHistoryDetail= operationHistoryDetail
      this.historyOperationDetailVisible = true
    },
    outputOperationLinkReport(){
      this.historyOperationDetailVisible = false
    }
  }

}
</script>
<style>
.AttackerComponent{
  width: 100%;
}
.tabs{
  height: 100%;
}
.tabs >div{
  padding: 0;
}
.tab-content-box{
  height: 100%;

  width: 100%
}
.attacker-statistic-info{
  width: 100%;
  margin-bottom: 10px;
}
.el-tabs__content {
  padding: 5px 0;
}

.attacker-operations-info-box{
  width: 100%;
}
.attacker-operations-info{
  margin-top: 10px;
  width: 100%;
}

.attacker-operations-info .operation-add{
  margin-top: 5px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.attacker-operations-info-item{
  padding: 0;
  text-align: left;
  padding-top: 10px;
}
.operation-info-setup{
  padding: 0;
}
.attacker-operations-select-box{
  padding: 0;
}
 .attacker-operations-select-box .el-segmented {
  min-width: 200px;
  --el-segmented-item-selected-color: white;
  --el-segmented-item-selected-bg-color: #e53c0d;
  --el-border-radius-base: 16px;
}
 .attacker-operations-selected{
  padding: 10px 0;
  width: 100%;
  border-top: 1px solid gainsboro;
}
.attacker-operations-history{
  padding-top: 10px;
  border-top: 1px solid gainsboro;
  width: 100%;
  text-align: center;
}
.attacker-operations-history .attacker-operation-history-view{
  margin-top: 5px;
}
.attacker-operation-history-view .el-button{
  margin-left: 10px;
}
.dialog_class{
  pointer-events: none;
}
.dialog_class .el-overlay-dialog{
  pointer-events: none;
}
.el-dialog__wrapper {
    pointer-events: none;
    
}
.el-dialog {
    pointer-events: auto;
}
</style>
