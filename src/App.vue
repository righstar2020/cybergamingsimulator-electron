<template>
    <div class="side-tab-bar" v-if="isShowSideTabBar">
      <router-link to="/" :class="currentRouteName=='home'?'router-active':''">兵棋博弈</router-link>
      <!--<router-link to="/networkSimulation" :class="currentRouteName=='networkSimulation'?'router-active':''">网络仿真</router-link>
      <router-link to="/gameSimulation" :class="currentRouteName=='gameSimulation'?'router-active':''">博弈仿真</router-link> -->
    </div>
    <div class="main-container">
      <router-view></router-view>
      <router-view name="EnvStatusWindowView"></router-view>
    </div>
</template>

<script>
export default {
  name: 'App',
  title:'攻防博弈', 
  data() {
    return {
      currentRouteName:'home',
      pagesNameList:['home'],
      isShowSideTabBar:false
    }
  },
  computed: {
    
  },
  created(){

  },
  mounted() {
  
  },
  watch:{
    '$route.name'(newVal,oldVal){
      this.currentRouteName = newVal
      console.log(newVal)
      this.pagesNameList.forEach(item=>{
        if(item == newVal){
          this.isShowSideTabBar = true
        }
      })
    },
    '$store.state.global.message'(newVal,oldVal){
      console.log(newVal)
      this.$message.info(newVal['message'])
    }

  },
  methods: {
    
  }

}
</script>

<style>
html,body{
  height: 100%;
  width: 100%;
  margin: 0;
  
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
body::-webkit-scrollbar {
    width: 8px; /* 设置滚动条宽度 */
}

.side-tab-bar{
  width: 80px;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  box-shadow: rgb(239, 237, 237) 2px 1px;
  border-radius: 0 0 10px 0;
  flex-wrap: wrap;
  word-break: break-all;
  padding-top: 30px;
}
.side-tab-bar a{
  font-size: 14px;
  width: 100%;
  padding: 30px 0;
}
.main-container{
  height: 100%;
  width: 100%;
  min-width: 500px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
a{text-decoration: none;color:#333;}

.side-tab-bar a:hover{
  color: white;
  background-color: #337ecc;
}
.router-link-active{
  color: white;
  background-color: #337ecc;
}
</style>
