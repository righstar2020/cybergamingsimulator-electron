<template>
    <div class="mapFlyLine" ref="mapFlyLine"></div>
</template>
  
<script>
  const echarts = require('echarts');
  const chinaData = require('./china.json');
  
  export default {
    data() {
      return {
        chart: null,
        centerCitys: [], // 总公司
        aroundCitys: [], // 子公司
        linesArr: [], // 飞线
      };
    },
    mounted() {
      this.load();
    },
    methods: {
      load() {
        this.centerCitys = [];
        this.aroundCitys = [];
        this.linesArr = [];
        // 中心点颜色，长度要与返回数据的总公司数一致
        const colorArr = ['#9BE6FF', '#F87B8F', '#7D82FD'];
        // 模拟数据
        const mockData = [
          {
            companyName: '公司A',
            provinceName: '内蒙古自治区',
            child: [
              {
                name: '子公司A1',
                coordiante: [113.625351, 34.746303],
              },
              {
                name: '子公司A2',
                coordiante: [103.834228, 36.060798],
              },
            ],
            coordiante: [113.186291, 42.646075],
          },
          {
            companyName: '公司B',
            provinceName: '新疆维吾尔自治区',
            child: [
              {
                name: '子公司B1',
                coordiante: [102.771252, 30.159369],
              },
            ],
            coordiante: [87.628579, 43.793301],
          },
          {
            companyName: '公司C',
            provinceName: '云南省',
            child: [
              {
                name: '子公司C1',
                coordiante: [93.762463, 30.102358],
              },
              {
                name: '子公司C2',
                coordiante: [109.494885, 24.081566],
              },
            ],
  
            coordiante: [101.716564, 24.761788],
          },
        ];
  
        mockData.forEach((center, index) => {
          this.centerCitys.push({
            name: center.companyName,
            value: center.coordiante,
            provinceName: center.provinceName,
            itemStyle: {
              color: colorArr[index],
              border: '2px solid #FFFFFF',
            },
            label: {
              show: true,
              formatter: center.companyName,
              position: 'top',
              padding: [0, 10],
              height: 30,
              lineHeight: 30,
              borderRadius: 5,
              textStyle: {
                fontSize: 14,
                fontWeight: 600,
                color: '#05092C',
              },
              backgroundColor: colorArr[index],
            },
          });
          center.child.forEach(child => {
            this.aroundCitys.push({
              name: child.name,
              value: child.coordiante,
              itemStyle: {
                color: colorArr[index],
              },
            });
  
            this.linesArr.push({
              name: `${child.name}-${center.companyName}`,
              coords: [center.coordiante, child.coordiante],
              // 线特效的配置
              effect: {
                color: colorArr[index],
              },
              lineStyle: {
                normal: {
                  width: 1.2,
                  curveness: 0.3,
                  color: colorArr[index],
                },
                opacity: 0.3,
              },
            });
          });
        });
        this.chart = echarts.init(this.$refs.mapFlyLine);
        echarts.registerMap('china', chinaData);
        this.chart.setOption(this.getOption());
      },
      getOption() {
        const regions = chinaData.features.map(item => {
          const { name } = item.properties;
          let areaColor = '#1C1E57';
          // 中心点所在省份设置特殊背景色
          const centerCityNameArr = this.centerCitys.map(item => {
            return item.provinceName;
          });
          if (centerCityNameArr.includes(name)) {
            areaColor = '#242874';
          }
          return {
            name: name,
            itemStyle: {
              normal: {
                areaColor: areaColor,
                borderColor: '#0E1037',
              },
            },
          };
        });
        const option = {
          grid: {
            left: '0',
            right: '0',
            bottom: '0',
            top: '0',
            containLabel: true,
          },
          // 地理坐标系组件
          geo: {
            map: 'china',
            zlevel: 13,
            show: true,
            layoutCenter: ['50%', '50%'],
            roam: true, // 是否开启鼠标缩放和平移漫游，只开启单个时，设置'scale' 或者 'move'
            layoutSize: '90%',
            zoom: 1.4, // 当前视角的缩放比例
            // 在地图中对特定的区域配置样式
            regions: regions,
            itemStyle: {
              normal: {
                color: 'rgba(28, 30, 87, 1)',
                borderWidth: 2,
                borderColor: 'rgba(125, 130, 253, 1)',
              },
            },
            emphasis: {
              disabled: true,
            },
          },
          series: [
            // 总公司
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              zlevel: 15,
              symbolSize: 16,
              // 涟漪特效相关配置
              rippleEffect: {
                period: 6, // 动画的周期，秒数
                num: 3, // 波纹的数量
                brushType: 'fill', // 波纹的绘制方式，可选 'stroke' 和 'fill'
                scale: 3, // 动画中波纹的最大缩放比例
              },
              data: this.centerCitys,
            },
            // 子公司
            {
              type: 'effectScatter',
              coordinateSystem: 'geo',
              zlevel: 15,
              symbolSize: 4,
              label: {
                show: true,
                formatter: params => params.name,
                position: 'bottom',
                textStyle: {
                  fontSize: 12,
                  color: '#43D0D6',
                },
              },
              data: this.aroundCitys,
            },
            // 飞线
            {
              type: 'lines',
              coordinateSystem: 'geo',
              zlevel: 15,
              // 线特效的配置
              effect: {
                show: true,
                period: 2, // 控制流星的速度，数字越小越快
                trailLength: 0.2, // 控制流星尾巴的长度，范围为0-1
                symbol: 'pin', // 尾巴形状，也可以设置成其他符号
                symbolSize: 10, // 尾巴大小
              },
              data: this.linesArr,
            },
            {
              type: 'map',
              mapType: 'china',
              zlevel: 12,
              layoutCenter: ['50%', '50%'],
              roam: false, // 'scale' 或者 'move'
              layoutSize: '90%',
              zoom: 1.4,
              data: [], // 空数据，不显示其他区域，只显示中国轮廓
              itemStyle: {
                normal: {
                  borderColor: 'rgba(125, 130, 253, 1)', // 高亮边框颜色
                  borderWidth: 5, // 高亮边框宽度
                },
              },
            },
          ],
        };
        return option;
      },
    },
  };
  </script>
  <style lang="less" scoped>
  .mapFlyLine {
    height: 584px;
  }
  </style>