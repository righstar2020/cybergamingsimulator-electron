
//启动后台进程background.js和初始化IPC监听
export default function(){
        require('../background/env_monitor.js');
        require('../background/game_monitor.js');
        require('../background/task_monitor.js');
        //初始化窗口IPC
        require('../window/window_ipc.js');
        //初始化全局store() 和事件IPC
        require('../store/index.js');
        require('../store/store_ipc.js');
}
