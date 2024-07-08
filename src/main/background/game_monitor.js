import store from '../store';
import {storeCommit} from '../store/send_store.js';
import {request_get,request_post} from '../util/request.js';
import { deepCopy,formatTimestamp,formatTimestamp2 } from '../util';
import {getObjectHash} from '../util/crypto.js' //判断数据是否有更新

function updateStore(commit_name,data) {
  try {
    storeCommit(commit_name, data);
  } catch (error) {
    console.error('Error commit:', error);
  }
}
// gamingStatus:{
//     totalStepNum:0,
//     currentGameRound:0,
//     currentPlayer:'attacker',
//     attackerOperationNum:0,
//     defenderOperationNum:0
// },
function updateGameStatus(){
  let gameStatus = store.getters.getGamingStatus
  gameStatus['currentGameRound']+=1
  gameStatus['currentPlayer'] = gameStatus['currentPlayer']=='attacker'?'defender':'attacker'
  updateStore('updateGamingStatus',gameStatus)
}

let digitalFlopData = {
  "totalOperationNum":{
    'title':'总操作数',
    'number':0,
    'fill_color':'#4d99fc',
    'unit':''
  },
  "attackerOperationNum":{
    'title':'攻击操作',
    'number':0,
    'fill_color':'#f46827',
    'unit':'次'
  },
  "defenderOperationNum":{
    'title':'防御操作',
    'number':0,
    'fill_color':'#40faee',
    'unit':'次'
  },
  "currentGameRound":{
    'title':'当前轮次',
    'number':0,
    'fill_color':'#4d99fc',
    'unit':'次'
  },
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
function updateLargeScreenData(){
  let headerDigitalData = store.getters.getHeaderDigitalData
  let taskHistoryData = store.getters.getTaskHistoryData
  let gameStatus = store.getters.getGamingStatus
  headerDigitalData['totalOperationNum']['number'] = taskHistoryData.length
  headerDigitalData['attackerOperationNum']['number'] = taskHistoryData.filter(item=>item[0]=='攻击者').length
  headerDigitalData['defenderOperationNum']['number'] = taskHistoryData.filter(item=>item[0]=='防御者').length
  headerDigitalData['currentGameRound']['number'] = gameStatus['currentGameRound']
  updateStore('updateHeaderDigitalData',headerDigitalData)
}

function game_loop(){
  //更新对抗信息
  updateGameStatus()
  //更新大屏展示数据
  updateLargeScreenData()
}
  
// 每隔一段时间执行一次轮询
let game_loop_interval = null
function start_task_loop(){
  if(game_loop_interval == null){
      console.log('start_game_loop!')
      game_loop_interval = setInterval(game_loop, 30000); // 每30秒执行一次
  }
}
start_task_loop()
export {start_task_loop}