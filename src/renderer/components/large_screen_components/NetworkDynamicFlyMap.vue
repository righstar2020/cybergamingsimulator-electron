<template>
  <div id="network-dynamic-chart">
    <div class="network-dynamic-chart-title">网络状态地图</div>
    <div id="worldMap"></div>
  </div>
</template>

<script>
// import worldMap from "./world.json" assert { type: "json" };
import worldMap from "@/assets/map/world-asia-center.json"
import { geoCoordMap, countryNameZH } from "@/assets/map/data.js";
import * as echarts from "echarts";
import { proccessNetworkDynamicMapData } from "../../core/environment";
import {getObjectHash} from "@/util/crypto.js";
echarts.registerMap("world", worldMap);
// 重庆经纬度
const chongqing = [106.557165, 29.570997];
const points = [
    [{ name: "美国", value: 200 }],
    [{ name: "日本", value: 100 }],
    [{ name: "加拿大", value: 134 }],
    [{ name: "古巴", value: 30 }],
    [{ name: "德国", value: 120 }],
    [{ name: "俄罗斯", value: 60 }],
    [{ name: "南非", value: 54 }],
    [{ name: "韩国", value: 30 }],
    [{ name: "阿根廷", value: 30 }],
];
export default {
  name: 'NetworkDynamicFlyMap',
  data () {
    return {
      myMapChart:null
    }
  },
  watch:{
    '$store.state.environmentMonitor.networkDynamicMapData'(newVal,oldVal){
      if(getObjectHash(newVal['topo_data'])!=getObjectHash(oldVal['topo_data'])){
        console.log("networkDynamicMapData:",newVal)
        this.updateFlylineMap(newVal['topo_data'])
      }
        
    }
  },
  created () {
    this.$nextTick(() => {
      let networkDynamicMapData = this.$store.getters.getEnvironmentMonitorData['networkDynamicMapData']['topo_data']
      this.initFlylineMap()
    })
  },
  methods: {
      //把拓扑的边转换成连线
      createFlyLineByLinks(links,nodes) {
        let flyLineList = []
        links.forEach((item) => {
            flyLineList.push([
                  {
                      coord: this.translationLng([nodes[item['from']]['longitude'],nodes[item['from']]['latitude']]), // 起点坐标
                  },
                  {
                      coord: this.translationLng([nodes[item['to']]['longitude'],nodes[item['to']]['latitude']]), // 终点坐标
                  },
              ])
          });
          return flyLineList
      },
      proccessNetworkDynamicMapData(networkDynamicMapData){
        let nodes = networkDynamicMapData['nodes']
        let links = networkDynamicMapData['links']
      },
      updateFlylineMap(networkDynamicMapData){
        let nodes = networkDynamicMapData['nodes']
        let links = networkDynamicMapData['links']
        const flyLineData = this.createFlyLineByLinks(links,nodes);
        const option = {
            backgroundColor: "#9ccffa",

            legend: {
                show: false,
            },
            geo: {
                map: "world", // 引用的地图名字
                zoom: 1,
                nameMap: countryNameZH,
                roam: true, // 禁止缩放平移
                regions: [
                    {
                        // 选中的区域
                        name: "中国",
                        selected: false,
                        itemStyle: {
                            areaColor: "#ffffff",
                            // 高亮时候的样式
                            emphasis: {
                                areaColor: "#ffffff",
                            },
                        },
                        label: {
                            emphasis: {
                                show: true,
                            },
                        },
                    },
                ],
                itemStyle: {
                    areaColor: "#f8f8f8",
                    borderColor: "#bbbbbb",
                },
                emphasis: {
                    areaColor: "#ffffff",
                    label: {
                        color: "#333",
                        fontSize: 14,
                    },
                },
            },
            series: [
                // 增强点(活跃点)
                {
                    type: "effectScatter",
                    coordinateSystem: "geo",
                    zlevel: 3,
                    rippleEffect: {
                        brushType: "stroke",
                    },
                    label: {
                        show: true,
                        position: "left",
                        formatter: "{b}",
                    },
                    symbolSize: 16,
                    itemStyle: {
                        color: "#26c2a6",
                    },
                    data: [
                        // {
                        //     value: this.translationLng(chongqing),
                        // },
                    ],
                },
                {
                    // 边特效
                    type: "lines",
                    zlevel: 1, // 用于分层，z-index的效果
                    effect: {
                        show: true, // 动效是否显示
                        period: 4, // 特效动画时间
                        trailLength: 0.7, // 特效尾迹的长度
                        color: "#fff", // 特效颜色
                        symbolSize: 3, // 特效大小
                    },
                    lineStyle: {
                        // 正常情况下的线条样式
                        color: "#337dfe",
                        width: 0, // 因为是叠加效果，要是有宽度，线条会变粗，白色航线特效不明显
                        curveness: 0.2, // 线条曲度
                    },
                    data: flyLineData, // 特效的起始、终点位置
                },
                {
                    // 边
                    type: "lines",
                    zlevel: 2,
                    symbolSize: 10,
                    effect: {
                        show: true,
                        period: 4, // 特效动画时间
                        trailLength: 0, // 特效尾迹的长度
                        symbolSize: 5, // 特效大小
                    },
                    label: {
                        show: false,
                    },
                    lineStyle: {
                        normal: {
                            color: "#337dfe",
                            width: 2,
                            opacity: 0.6,
                            curveness: 0.2,
                        },
                    },
                    data: flyLineData, // 特效的起始、终点位置，一个二维数组
                },
                {
                    // 起始点
                    type: "effectScatter",
                    coordinateSystem: "geo", // 表示使用的坐标系为地理坐标系
                    zlevel: 3,
                    rippleEffect: {
                        brushType: "stroke", // 波纹绘制效果
                    },
                    label: {
                        normal: {
                            // 默认的文本标签显示样式
                            show: true,
                            position: "left", // 标签显示的位置
                            formatter: "{b}", // 标签内容格式器
                        },
                    },
                    itemStyle: {
                        normal: {
                            color: "#337dfe",
                        },
                    },
                    data: Object.values(nodes).map((item) => {
                        for(let i=0;i<links.length;i++){
                            if(links[i]['from']==item['id'])
                            return {
                                value: this.translationLng(item['longitude'],item['latitude']),
                                symbolSize: 10,
                            };
                        }
                    }),
                },
                {
                    // 终点
                    type: "effectScatter",
                    coordinateSystem: "geo",
                    zlevel: 3,
                    rippleEffect: {
                        brushType: "stroke",
                    },
                    label: {
                        show: true,
                        position: "left",
                        formatter: "{b}",
                    },
                    symbolSize: 16,
                    itemStyle: {
                        color: "#26c2a6",//汇点颜色
                    },
                    // data: Object.values(nodes).map((item) => {
                    //     for(let i=0;i<links.length;i++){
                    //         if(links[i]['to']==item['id'])
                    //         return {
                    //             value: this.translationLng(item['longitude'],item['latitude']),
                    //             symbolSize: 10,
                    //         };
                    //     }
                    // }),
                },
            ],
        };


        //更新世界地图飞线图
        if( this.myMapChart!=null)
            this.myMapChart.setOption(option);
      },
      initFlylineMap(){
        this.myMapChart = echarts.init(document.getElementById("worldMap"));
        const flyLineData = this.createFlyLine(points);
        const option = {
            backgroundColor: "#9ccffa",

            legend: {
                show: false,
            },
            geo: {
                map: "world", // 引用的地图名字
                zoom: 1,
                nameMap: countryNameZH,
                roam: true, // 禁止缩放平移
                regions: [
                    {
                        // 选中的区域
                        name: "中国",
                        selected: false,
                        itemStyle: {
                            areaColor: "#ffffff",
                            // 高亮时候的样式
                            emphasis: {
                                areaColor: "#ffffff",
                            },
                        },
                        label: {
                            emphasis: {
                                show: true,
                            },
                        },
                    },
                ],
                itemStyle: {
                    areaColor: "#f8f8f8",
                    borderColor: "#bbbbbb",
                },
                emphasis: {
                    areaColor: "#ffffff",
                    label: {
                        color: "#333",
                        fontSize: 14,
                    },
                },
            },
            series: [
                // 中国重庆点位
                {
                    type: "effectScatter",
                    coordinateSystem: "geo",
                    zlevel: 3,
                    rippleEffect: {
                        brushType: "stroke",
                    },
                    label: {
                        show: true,
                        position: "left",
                        formatter: "{b}",
                    },
                    symbolSize: 16,
                    itemStyle: {
                        color: "#26c2a6",
                    },
                    data: [
                        // {
                        //     value: this.translationLng(chongqing),
                        // },
                    ],
                },
                {
                    // 白色尾迹特效图
                    type: "lines",
                    zlevel: 1, // 用于分层，z-index的效果
                    effect: {
                        show: true, // 动效是否显示
                        period: 4, // 特效动画时间
                        trailLength: 0.7, // 特效尾迹的长度
                        color: "#fff", // 特效颜色
                        symbolSize: 3, // 特效大小
                    },
                    lineStyle: {
                        // 正常情况下的线条样式
                        color: "#337dfe",
                        width: 0, // 因为是叠加效果，要是有宽度，线条会变粗，白色航线特效不明显
                        curveness: 0.2, // 线条曲度
                    },
                    data: flyLineData, // 特效的起始、终点位置
                },
                {
                    // 连线线效果
                    type: "lines",
                    zlevel: 2,
                    symbolSize: 10,
                    effect: {
                        show: true,
                        period: 4, // 特效动画时间
                        trailLength: 0, // 特效尾迹的长度
                        symbolSize: 5, // 特效大小
                    },
                    label: {
                        show: false,
                    },
                    lineStyle: {
                        normal: {
                            color: "#337dfe",
                            width: 1,
                            opacity: 0.6,
                            curveness: 0.2,
                        },
                    },
                    //data: flyLineData, // 特效的起始、终点位置，一个二维数组
                },
                {
                    // 散点效果
                    type: "effectScatter",
                    coordinateSystem: "geo", // 表示使用的坐标系为地理坐标系
                    zlevel: 3,
                    rippleEffect: {
                        brushType: "stroke", // 波纹绘制效果
                    },
                    label: {
                        normal: {
                            // 默认的文本标签显示样式
                            show: true,
                            position: "left", // 标签显示的位置
                            formatter: "{b}", // 标签内容格式器
                        },
                    },
                    itemStyle: {
                        normal: {
                            color: "#337dfe",
                        },
                    },
                    // data: points.map((item) => {
                    //     return {
                    //         value: this.translationLng(geoCoordMap[item[0].name]),
                    //         symbolSize: 10,
                    //     };
                    // }),
                },
                {
                    // 终点
                    type: "effectScatter",
                    coordinateSystem: "geo",
                    zlevel: 3,
                    rippleEffect: {
                        brushType: "stroke",
                    },
                    label: {
                        show: true,
                        position: "left",
                        formatter: "{b}",
                    },
                    symbolSize: 16,
                    itemStyle: {
                        color: "#26c2a6",//汇点颜色
                    },
                    data: [
                        {
                            // value: this.translationLng(chongqing),
                        },
                    ],
                },
            ],
        };


        //初始化世界地图飞线图
        //this.myMapChart.setOption(option);
      },
        /**
         * 平移经度，适配亚洲为中心的地图
         * 把经纬度转换为地图坐标
         */
      translationLng([lng, lat]){
          if (lng > -30) {
              lng = lng - 180;
          } else {
              lng = lng + 180;
          }
          return [lng, lat];
      },
      
      // 获取地图中起点和终点的坐标，以数组形式保存下来
      createFlyLine(data) {
          return data.map((item) => {
              const fromCoord = geoCoordMap[item[0].name];
              const toCoord = chongqing;
              return [
                  {
                      coord: this.translationLng(fromCoord), // 起点坐标
                  },
                  {
                      coord: this.translationLng(toCoord), // 终点坐标
                  },
              ];
          });
      },


  },
  mounted () {
  }
}
</script>

<style lang="less">
#network-dynamic-chart {
  width: 100%;
  height: 100%;
  background-color: rgba(6, 30, 93, 0.5);
  border-top: 2px solid rgba(243, 71, 14, 0.886);
  box-sizing: border-box;
  
  .network-dynamic-chart-title {
    height: 50px;
    font-weight: bold;
    text-indent: 20px;
    font-size: 20px;
    display: flex;
    align-items: center;
  }

  #worldMap {
    height: calc(~"100% - 50px");
    width: 100%;
  }
  #test{
    background-color: #26c2a6;
  }
}
</style>
