<template>
  <div class="DefenderComponent">
    <el-tabs class="tabs" type="border-card">
          <el-tab-pane label="防御选择">
            <div class="tab-content-box" id="defender-select-tab">
              <div class="defender-statistic-info">
                  <el-row >
                    <el-col :span="8">
                      <el-statistic title="对抗轮次" :value="currentGameRoundNum" />
                    </el-col>
                    <el-col :span="8">
                      <el-statistic title="执行操作数" :value="currentOperationNum" />
                    </el-col>
                    <el-col :span="8">
                      <el-statistic title="防御成功数" :value="currentSuccesssDefendNum" />
                    </el-col>
                 </el-row>
              </div>
              <el-scrollbar height="600px">
              <div class="defender-operations-select-box">
                <el-segmented v-model="currentDefendOperationTypeTab" :options="defendOperationTypeTabs" />
                  <div class="defender-operations-info-box">
                    <div class="defender-operations-info">
                      <el-collapse class="defender-operations-info-collapse" v-model="activeDefenderOperatonInfo" accordion>
                        <el-collapse-item v-if="currentDefendOperationTypeTab=='信号'" v-for="(item,index) in defenderSignalOperationsList" v-key="index" :title="item.title" :name="item.title" class="defender-operations-info-item" >
                          <div class="operation-info-setup"  v-html="formattedText(item.description)">
                          </div>
                           <div class="operation-add">
                            <el-button type="primary" @click="openDefenderOperationForm(currentDefendOperationTypeTab,index)">添加</el-button>
                           </div>
                        </el-collapse-item>
                        <el-collapse-item v-if="currentDefendOperationTypeTab=='动作'" v-for="(item,index) in defenderActionOperationsList" v-key="index" :title="item.title" :name="item.title" class="defender-operations-info-item" >
                          <div class="operation-info-setup" v-html="formattedText(item.description)">
                          </div>
                           <div class="operation-add">
                            <el-button type="primary" @click="openDefenderOperationForm(currentDefendOperationTypeTab,index)">添加</el-button>
                           </div>
                        </el-collapse-item>
                    </el-collapse>
                    </div>
                  </div>
                  <div class="defender-operations-selected" >
                    <el-table :data="currentDefenderSelectedOperationLinkData" style="width: 100%;text-align: left;"  >
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
                              <el-button type="primary" size="small" @click="editDefenderSelectedOperation(scope_2.$index)" >修改</el-button>
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
                            <el-button style="margin-top: 10px;"   type="primary" size="small"  @click="saveEditedDefenderSelectedOperation(scope_2.$index)">
                              保存
                            </el-button>
                          </el-popover>
                          <el-button type="danger"  size="small" @click="deleteDefenderSelected(scope_2.$index)">
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
                      @click="runDefenderOperationsLink"
                     >
                    执行操作链
                  </el-button>
              </div>
              <div class="defender-operations-history">
                  <el-timeline style=" max-width: 220px">
                    <el-timeline-item
                        v-for="(item,index) in defenderOperationsHistory"
                        :key="index"
                        :timestamp="item.timestamp"
                        :color="item.status=='success'?'#0bbd87':''"
                        size="large"
                      >
                        <div class="defender-operation-history-view">

                          {{ item.title }}
                          <el-button type="primary" size="small" @click="viewOperationHistoryDetail(index)" >详情</el-button>
                        </div>
                      </el-timeline-item>
                  </el-timeline>
              </div>
            </el-scrollbar>
            </div>
          </el-tab-pane>
          <el-tab-pane label="环境状态">
            <div class="tab-content-box" id="defender-env-status-tab">

            </div>
          </el-tab-pane>
          <el-tab-pane label="防御配置">
            <div class="tab-content-box" id="defender-config-tab">

            </div>
          </el-tab-pane>
      </el-tabs>
      <!--全局对话框-->
      <!--defender operation select-->
      <el-dialog v-model="defenderOperationFormVisible" 
          :modal="false" 
          :close-on-click-modal="false"
          title="防御者操作选择"
          width="400" 
          modal-class="dialog_class"
          draggable
          append-to-body
          >
        <el-form :model="defenderOperationForm.params">
          <el-form-item v-for="(param,index) in defenderOperationForm.params" :label="param.title" label-width="100">
            <el-select v-if="param.formType=='select'" v-model="defenderOperationForm.params[index].value" >
            </el-select>
            <el-input v-if="param.formType=='input'" v-model="defenderOperationForm.params[index].value" autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="defenderOperationFormVisible = false">取消</el-button>
            <el-button type="primary" @click="saveDefenderOperationForm">
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
          <el-table :data="defenderOperationsHistoryDetail.operationLink">
            <el-table-column width="50" property="id" label="id" />
            <el-table-column width="100" property="title" label="name" />
            <el-table-column width="100" property="status" label="状态" >
              <template #default="scope_status">
                <el-tag>{{ scope_status.row.status  }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column width="120" v-for="(item,index) in defenderOperationsHistoryDetail.operationLinkParamsName"  :property="item.name" :label="item.title">
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
export default {
  name: 'DefenderComponent',
  data(){
    return {
      dialogStyle:'z-index:0',
      currentGameRoundNum:0,
      currentOperationNum:0,
      currentSuccesssDefendNum:0,
      currentDefendOperationTypeTab:'信号',
      defendOperationTypeTabs:['信号','动作'],
      activeDefenderOperatonInfo:'',
      defenderSignalOperationsList:[], //从全局state中加载
      defenderActionOperationsList:[],
      editOperationVisible:true,
      currentEditOperationData:[],
      defenderOperationFormVisible:false,
      defenderOperationForm:{},
      currentDefenderSelectedOperationLinkData:[],
      currentRunningOperationLink:[],
      defenderOperationsHistory:[],
      historyOperationDetailVisible:false,
      defenderOperationsHistoryDetail:{}   
    }
  },
  watch:{
    '$store.state.global.currentCopyFormData'(newVal,oldVal){
        //formData有更新并且正在输入时复制相应的数据
      let defenderOperationFormParams = this.defenderOperationForm.params
      console.log("值发生变化:"+newVal)
      if(this.defenderOperationFormVisible){
        Object.keys(newVal).forEach((key)=>{
          for(let i =0;i<defenderOperationFormParams.length;i++){
            if(defenderOperationFormParams[i].name==key){
              //找到相应主键则赋值
              if(newVal[key]!=null){
                defenderOperationFormParams[i].value = newVal[key]
              }
            }
          }
        })
        this.defenderOperationForm.params=defenderOperationFormParams

      }
    },
    '$store.state.defender.historyOperation'(newVal,oldVal){
      if(newVal.length>0){
        this.defenderOperationsHistory = newVal
        this.$message.info('操作执行更新')
      }
    }
  },
  mounted(){
    //获取全局state数据
    let defenderActionOperation = this.$store.getters.getDefenderBaseOperation
    if(defenderActionOperation!=null){
        this.defenderSignalOperationsList = defenderActionOperation.signal
        this.defenderActionOperationsList = defenderActionOperation.action
    }
  },
  methods: {
    formattedText(text) {
      // 使用replace将\n替换为<br>以在HTML中创建换行
      console.log(text)
      return text.replace(/\n/g, '<br>');
    },
    openDefenderOperationForm(operationType,index){
      this.defenderOperationFormVisible = true
      console.log(operationType,index)
      if(operationType=='信号'){
        this.defenderOperationForm=this.defenderSignalOperationsList[index]
      }
      if(operationType=='动作'){
        this.defenderOperationForm=this.defenderActionOperationsList[index]
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
    saveDefenderOperationForm(){
      this.defenderOperationFormVisible = false
      //保存操作输入
      let defenderOperationForm = deepCopy(this.defenderOperationForm)
      //生成操作ID
      let currentDefenderSelectedOperationLinkData=this.currentDefenderSelectedOperationLinkData
      let id = generateMD5TimestampId(this.currentDefenderSelectedOperationLinkData.length)
      defenderOperationForm['id']=id
      if(defenderOperationForm!=null){
        if(this.checkFormInput(defenderOperationForm)){
          console.log(defenderOperationForm)
          this.currentDefenderSelectedOperationLinkData.push(defenderOperationForm)
        }
      }
    },
    editDefenderSelectedOperation(index){
      let currentSelectedOperation = this.currentDefenderSelectedOperationLinkData[index]
      let currentEditOperationData = []
      currentEditOperationData.push(currentSelectedOperation)
      this.currentEditOperationData=currentEditOperationData
      console.log(currentSelectedOperation)
    },
    saveEditedDefenderSelectedOperation(index){
      this.editOperationVisible=false
    },
    deleteDefenderSelected(index){
      if(index<this.currentDefenderSelectedOperationLinkData.length)
        this.currentDefenderSelectedOperationLinkData.splice(index,1)
    },
    runDefenderOperationsLink(){
      let currentOperationLinkList = deepCopy(this.currentDefenderSelectedOperationLinkData)
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
      let operationLinkId=generateMD5TimestampId(this.defenderOperationsHistory.length)
      let operationLinkData = {
        operationLinkId:operationLinkId,
        title:currentOperationLinkList[0].title+'等操作',
        timestamp:timestamp,
        status:'running',
        operationLinkParamsName:operationLinkParamsName,
        operationLink:currentOperationLinkList
      }
      this.$store.commit('addDefenderHistoryOperation',operationLinkData)
      this.defenderOperationsHistory.push(operationLinkData)
      this.currentDefenderSelectedOperationLinkData=[]
      //远端执行操作链
      proccess_operation_link_to_task('defender',operationLinkId,currentOperationLinkList)
    },
    getOperationRunningResult(operationLinkId){

    },
    viewOperationHistoryDetail(index){
      let operationHistoryDetail = this.defenderOperationsHistory[index]
      this.defenderOperationsHistoryDetail= operationHistoryDetail
      this.historyOperationDetailVisible = true
    },
    outputOperationLinkReport(){
      this.historyOperationDetailVisible = false
    }
  }

}
</script>
<style>
.DefenderComponent{
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
.defender-statistic-info{
  width: 100%;
  margin-bottom: 10px;
}
.el-tabs__content {
  padding: 5px 0;
}

.defender-operations-info-box{
  width: 100%;
}
.defender-operations-info{
  margin-top: 10px;
  width: 100%;
}

.defender-operations-info .operation-add{
  margin-top: 5px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.defender-operations-info-item{
  padding: 0;
  text-align: left;
  padding-top: 10px;
}
.operation-info-setup{
  padding: 0;
}
.defender-operations-select-box{
  padding: 0;
}
 .defender-operations-select-box .el-segmented {
  min-width: 200px;
  --el-segmented-item-selected-color: white;
  --el-segmented-item-selected-bg-color: #5da0e9;
  --el-border-radius-base: 16px;
}
 .defender-operations-selected{
  padding: 10px 0;
  width: 100%;
  border-top: 1px solid gainsboro;
}
.defender-operations-history{
  padding-top: 10px;
  border-top: 1px solid gainsboro;
  width: 100%;
  text-align: left;
}
.defender-operations-history .defender-operation-history-view{
  margin-top: 5px;
}
.defender-operation-history-view .el-button{
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
