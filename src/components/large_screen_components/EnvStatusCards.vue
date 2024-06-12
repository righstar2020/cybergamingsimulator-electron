<template>
  <div id="cards">
    <div
      class="card-item"
      v-for="(card, i) in cards"
      :key="card.title"
      >
      <div class="card-header">
        <div class="card-header-left">{{ card.title }}</div>
        <div class="card-header-right">{{ '0' + (i + 1) }}</div>
      </div>
      <dv-charts class="ring-charts" :option="card.ring" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EnvStatusCards',
  data () {
    return {
      cards: []
    }
  },
  methods: {
    createData () {
      const { randomExtend } = this
      const charts_name_list = ['CPU使用率','内存使用率']
      this.cards = new Array(2).fill(0).map((foo, i) => ({
        title: charts_name_list[i],
        total: {
          number: [randomExtend(9000, 10000)],
          content: '{nt}',
          textAlign: 'right',
          style: {
            fill: '#ea6027',
            fontWeight: 'bold'
          }
        },
        num: {
          number: [randomExtend(30, 60)],
          content: '{nt}',
          textAlign: 'right',
          style: {
            fill: '#26fcd8',
            fontWeight: 'bold'
          }
        },
        ring: {
          series: [
            {
              type: 'gauge',
              startAngle: -Math.PI / 2,
              endAngle: Math.PI * 1.5,
              arcLineWidth: 13,
              radius: '80%',
              data: [
                { name: '使用占比', value: randomExtend(40, 60) }
              ],
              axisLabel: {
                show: false
              },
              axisTick: {
                show: false
              },
              pointer: {
                show: false
              },
              backgroundArc: {
                style: {
                  stroke: '#224590'
                }
              },
              details: {
                show: true,
                formatter: '占比{value}%',
                style: {
                  fill: '#1ed3e5',
                  fontSize: 20
                }
              }
            }
          ],
          color: ['#03d3ec']
        }
      }))
    },
    randomExtend (minNum, maxNum) {
      if (arguments.length === 1) {
        return parseInt(Math.random() * minNum + 1, 10)
      } else {
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
      }
    }
  },
  mounted () {
    const { createData } = this

    createData()

    setInterval(this.createData, 30000)
  }
}
</script>

<style lang="less">
#cards {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  height: 100%;
  width: 100%;

  .card-item {
    background-color: rgba(6, 30, 93, 0.5);
    border-top: 2px solid rgba(1, 153, 209, .5);
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .card-header {
    display: flex;
    height: 20%;
    align-items: center;
    justify-content: flex-start;

    .card-header-left {
      font-size: 14px;
      font-weight: bold;
      font-size: 90%;
      margin-left: 10px;
      width: 50%;
    }

    .card-header-right {
      margin-left: 10px;
      font-size: 100%;
      color: #03d3ec;
      width: 30%;
      text-align: left;
    }
  }

  .ring-charts {
    height: 100%;
  }

 


}
</style>
