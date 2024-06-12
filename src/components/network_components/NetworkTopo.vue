<template>
    <div class="network-topo">
        <!--顶部固定菜单-->
        <div class="network-top-box">
            <div class="network-info">
                <div class="network-info-item">
                    网络模式:{{ currentNetworkMode }}
                </div>
                <div class="network-info-item">
                     <el-button type="primary" size="small" @click="networkModeConfigClick">设置</el-button>
                </div>
            </div>
            <div class="gaming-status-box">
                <div class="gaming-status-item">
                    当前player
                </div>
                <div class="gaming-status-item">
                    <el-tag :type="currentPlayer=='attacker'?'danger':'info'" effect="dark" >
                        攻击者
                    </el-tag>
                    <el-tag :type="currentPlayer=='defender'?'primary':'info'" effect="dark" >
                        防御者
                    </el-tag>
                </div>
            </div>
        </div>
        <div  class="network-container" @contextmenu.prevent="topoMenuHandle" @click.prevent="topoMenuStopHandle">
            <div id="network-topo-container"></div>
            <!--自定义右键按钮-->
            <div v-if="isShowTopoMenu" class="menu_box" :style="{'left': topoMenuLeft + 'px', 'top': topoMenuTop + 'px'}">
                <div class="menu">
                    <div class="menu_item item_text" @click.stop="menuItemClick(0)">复制IP</div>
                    <div class="menu_item item_text" @click.stop="menuItemClick(1)">复制名称</div>
                </div>
            </div>
        
        </div>
        <div class="large-screen-monitor" @click="openlargeScreenMonitor">
            大屏监控
        </div>
    </div>
    
</template>

<script>
require("vis-network/dist/dist/vis-network.min.css");
import clipboard from 'clipboard';
const hostImage = require("../../assets/host.png");
const vis = require("vis-network/dist/vis-network.min");
export default {
     name: 'networkTopo',
     data() {
         return {
            currentNetworkMode:'本地',
             networkTopoData: {},
             mockTopoData: {
                nodes: [],
                edges: []
            },
            network:null,
            currentSelectedNode:null,
            currentSelectedLink:null,
            isShowTopoMenu:false,
            topoMenuTop:0,
            topoMenuLeft:0,
            currentPlayer:'defender'
         }
     },
     mounted() {
        this.initNetworkTopo(this.genMockTopoData())
     },
     methods: {
        networkModeConfigClick(){

        },
        genMockTopoData() {
            let nodes = [];
            let edges =[];
            for (let i = 0; i < 10; i++) {
                nodes.push({
                    id: i,
                    label: "Host " + i,
                    group: i % 2,
                    image: hostImage,
                    shape: "image",
                    ip: "10.0.0." + i
                });
                if (i > 0) {
                    edges.push({
                        from: i - 1,
                        to: i
                    })
                }
            }
           let mockTopoData = {
            nodes: nodes,
            edges: new vis.DataSet(edges)
           }
           this.networkTopoData = mockTopoData
           return mockTopoData
        },
        
        initNetworkTopo(topoData) {
            let container = document.getElementById("network-topo-container");
            // 5.全局配置
            let options = {
                autoResize: true, //网络将自动检测其容器的大小调整，并相应地重绘自身
                locale: "cn", //语言设置：工具栏显示中文
                //设置语言
                locales: {
                    cn: {
                        //工具栏中文翻译
                        edit: "编辑",
                        del: "删除当前节点或关系",
                        back: "返回",
                        addNode: "添加节点",
                        addEdge: "添加连线",
                        editNode: "编辑节点",
                        editEdge: "编辑连线",
                        addDescription: "点击空白处可添加节点",
                        edgeDescription: "点击某个节点拖拽连线可连接另一个节点",
                        editEdgeDescription: "可拖拽连线改变关系",
                        createEdgeError: "无法将边连接到集群",
                        deleteClusterError: "无法删除集群.",
                        editClusterError: "无法编辑群集'",
                    },
                },
                //该配置项主要用来生成一个可视化的配置器
                configure: {
                    enabled: false,
                    filter: "nodes,edges",
                    container: container,
                    showButton: true,
                },
                // 组模块
                groups: {
                    useDefaultGroups: true,
                    myGroupId: {},
                    host: {
                        color: { background: "#42bef0" },
                        font: { color: "white" },
                    },
                    attacker: {
                        color: { background: "#ee430f" },
                        font: { color: "white" },
                    },
                },
                // 设置节点样式
                nodes: {
                    shape: "ellipse", //节点的外观。为circle时label显示在节点内，为dot时label显示在节点下方
                    size: 30, //节点的大小，
                    shadow: false, //如果为true，则节点使用默认设置投射阴影。
                    font: {
                    //字体配置
                        size: 20,
                        color: "#000",
                        align: "center",
                    },
                    color: {
                        border: "transparent", //节点边框颜色
                        background: "#fd91b7", //节点背景颜色
                        highlight: {
                            //节点选中时状态颜色
                            border: "rgb(117, 218, 167)",
                            background: "rgb(117, 218, 167)",
                        },
                        hover: {
                            //节点鼠标滑过时状态颜色
                            border: "#dff9fb",
                            background: "#88dab1",
                        },
                    },
                    margin: 5, //当形状设置为box、circle、database、icon、text；label的边距
                    widthConstraint: 100, //设置数字，将节点的最小和最大宽度设为该值,当值设为很小的时候，label会换行，节点会保持一个最小值，里边的内容会换行
                    borderWidth: 1, //节点边框宽度，单位为px
                    borderWidthSelected: 3, //节点被选中时边框的宽度，单位为px
                    labelHighlightBold: false, //确定选择节点时标签是否变为粗体
                },
                // 边线配置
                edges: {
                    width: 1,
                    length: 200,
                    color: {
                        color: "#000",
                        highlight: "#ee430f",
                        hover: "#000",
                        inherit: "from",
                        opacity: 1.0,
                    },
                    shadow: false,
                    smooth: {
                        //设置两个节点之前的连线的状态
                        enabled: true, //默认是true，设置为false之后，两个节点之前的连线始终为直线，不会出现贝塞尔曲线
                    }
                
                },
                           
            };
            // 6.初始化网络拓扑图
            var network = new vis.Network(container, topoData, options);
            this.network = network
                //订阅network相关的事件
            this.network.on("oncontext", (e) => {
                this.topoMenuHandle(e)
            });
        },
        topoMenuHandle(e){
            this.isShowTopoMenu=true
            console.log(e)
            this.topoMenuTop=e.offsetY
            this.topoMenuLeft=e.offsetX
            //获取鼠标指向的节点，需要dom坐标
            var nodeId = this.network.getNodeAt({
                x:e.offsetX,
                y:e.offsetY
            });
            console.log("currentNodeId:"+nodeId)
            if(nodeId!=undefined){
                this.currentSelectedNode = this.networkTopoData.nodes[nodeId]
                console.log("currentSelectedNode:")
                console.log(this.currentSelectedNode)
            }            
        },
        updateEdge(){},
        openlargeScreenMonitor(){
            const data = {
                title: '大屏监控',
                url: 'largeScreenMonitor',
                full_screen:true
            };
            //创建新无边框窗口
            this.$electron.ipcRenderer.send('open-frameless-window-by-local-url', data);
        },
        topoMenuStopHandle(e){
            this.isShowTopoMenu=false
            this.currentSelectedNode=null
        },
        menuItemClick(index){
            this.isShowTopoMenu=false
            if(index==0){
                //复制目标IP到剪切板
                if(this.currentSelectedNode!=null){
                    let targetIp = this.currentSelectedNode.ip
                    console.log(targetIp)
                    clipboard.copy(targetIp);
                    this.$message({
                        message: '复制成功',
                        type:'success'
                    })
                    //复制给全局form输入
                    this.$store.commit('updateCurrentCopyFormData',{
                        target_ip:targetIp
                    })
                }
                
            }
            if(index==1){
                //复制节点名称到剪切板
                if(this.currentSelectedNode!=null){
                    let nodeLabel = this.currentSelectedNode.label
                    clipboard.copy(nodeLabel);
                    this.$message({
                        message: '复制成功',
                        type:'success'
                    }) 
                }
            }
            this.currentSelectedNode = null
        },
     }
 }
</script>

<style>
.network-topo{
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
    margin-top: -5px;
}
.network-top-box{
    position: absolute;
    top: 0;
    right: 0;
    background: transparent;
    z-index: 1000;
    height: 60px;
    width: 100%;
}
.large-screen-monitor{
    position: absolute;
    top: 30%;
    right: 0;
    box-shadow: #e7eff3 2px 2px 2px;
    background-color: #9cc0ef;
    opacity: 0.8;
    z-index: 1000;
    height: 60px;
    width: 25px;
    padding: 0 5px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: black;
    border-radius: 3px 0 0 3px;
}
.large-screen-monitor:hover{
    background: #3b85e4;
    color: white;
    cursor: pointer;
}
.network-top-box .network-info{
    position: absolute;
    left: 0;
    width: 165px;
    height: 50%;
    font-size: 15px;
    
    display: flex;
    align-items: center;
    justify-content: flex-start;
    box-shadow: #e7eff3 2px 2px 2px;
    background-color: #ade0f8;
    opacity: 0.9;
    padding: 4px 0;
    padding-left:6px;
    border-radius: 0 0 5px 0;
}
.network-info .network-info-item{
    padding-right: 10px;
}
.network-top-box .gaming-status-box{
    position: absolute;
    right: 0;
    width: 120px;
    height: 100%;
    font-size: 15px;
    background-color: #9cc0ef;
    opacity: 0.9;
    border-radius: 0 0 0 5px;
    box-shadow: #e7eff3 2px 2px 2px;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

}
.gaming-status-box .gaming-status-item{
    color: white;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    width: 50%;
    opacity: 1;
}
.gaming-status-item .el-tag {
    margin-top: 3px;
}
.network-container{
    width: 100%;
    height: 100%;
    position: relative;
}
#network-topo-container{
    width:100%;
    height: 100%;
}
.menu_box {
  position: absolute;
  z-index: 1004;
  background-color: #fff;
  border-radius: 5px;
  
}
.menu{
    border-radius: 5px;
    width: 120px;
    text-align: left;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.menu .menu_item{
    height: 24px;
  
}
.item_text{
    color: #171A1D;
    cursor: pointer;
    padding: 4px 20px;
    border-radius: 5px;
    transition: all .1s ease-in;
}
.item_text:hover {
    background-color: #E9EAEC;
}
.test{
    color:#ee430f;
    color:#42bef0;
}

</style>