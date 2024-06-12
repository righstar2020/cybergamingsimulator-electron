// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import cyberGamingSimulationPage from '@/components/CyberGamingSimulation.vue'
import networkSimulationPage from '@/components/NetworkSimulation.vue'
import gameSimulationPage from '@/components/GameSimulation.vue'
import largeScreenMonitor from '@/components/large_screen_components/LargeScreenMonitor.vue'
import reportWindow from '@/components/report_components/ReportWindow.vue'
import EnvStatusWindow from '@/components/window_components/EnvStatusWindow.vue'
const routes = [
    { path: '/', name: 'home', component: cyberGamingSimulationPage },
    { path: '/cyberGamingSimulation', name: 'cyberGamingSimulation', component: cyberGamingSimulationPage },
    { path: '/networkSimulation', name: 'networkSimulation', component: networkSimulationPage },
    { path: '/gameSimulation', name: 'gameSimulation', component: gameSimulationPage },
    { path: '/largeScreenMonitor', name: 'largeScreenMonitor', component: largeScreenMonitor },
    { path: '/reportWindow', name: 'reportWindow', component: reportWindow },
    { 
      path: '/envStatusWindow/:player/:statusName',  
      name: 'envStatusWindow',  
      components:{
        EnvStatusWindowView:EnvStatusWindow
      }
    }
]

const router = createRouter({
  mode:'history',
  history: createWebHistory(),
  routes,
})

// 确保export导出router实例
export default router