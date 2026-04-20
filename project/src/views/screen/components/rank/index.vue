<template>
  <div class="box6">
    <div class="title">
      <p>近七日交易额</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <!-- 图形图标的容器 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { reqTurnoverPast7Day } from '@/api/info'
import { Right } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
//获取DOM节点
let charts = ref()
let date = new Date().getDate()

const a = ref<number[]>([])

//组件挂载完毕
onMounted(() => {
  reqTurnoverPast7Day().then((res) => {
    a.value = res as number[]
    //一个容器可以同时展示多种类型的图形图标
    let mychart = echarts.init(charts.value)
    //设置配置项
    mychart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
      },
      legend: {
        textStyle: {
          color: '#fff',
        },
      },
      grid: {
        bottom: 30,
        left: 60,
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            alignWithLabel: true,
          },
          data: [
            date - 6 + '号',
            date - 5 + '号',
            date - 4 + '号',
            date - 3 + '号',
            date - 2 + '号',
            date - 1 + '号',
            date + '号',
          ],
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: '交易额',
          min: 0,
          max: Math.max(...a.value) + 30,
          position: 'left',
          axisLabel: {
            formatter: '{value} 元',
          },
        },
      ],
      series: [
        {
          name: '交易额',
          type: 'bar',
          yAxisIndex: 0,
          data: a.value,
        },
      ],
    })
  })
})
</script>

<style scoped lang="less">
.box6 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0px;

  .title {
    margin-left: 5px;
    margin-top: 10px;
    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    height: calc(100% - 30px);
  }
}
</style>
