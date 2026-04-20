<template>
  <div class="box8">
    <div class="title">
      <p>数据统计</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
//获取DOM节点
let charts = ref()
//组件挂载完毕
onMounted(() => {
  //一个容器可以同时展示多种类型的图形图标
  let mychart = echarts.init(charts.value)
  let option = {
    title: {
      text: '商品消费统计',
      textStyle: {
        color: 'white',
      },
    },
    radar: {
      // shape: 'circle',
      indicator: [
        { name: '数码' },
        { name: '衣物' },
        { name: '食品' },
        { name: '家电' },
        { name: '生活' },
        { name: '其它' },
      ],
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
          },
        ],
      },
    ],
  }
  //设置配置项
  mychart.setOption(option)
})
</script>

<style scoped lang="less">
.box8 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 20px;

  .title {
    p {
      color: white;
      font-size: 18px;
    }
  }

  .charts {
    height: calc(100% - 30px);
  }
}
</style>
