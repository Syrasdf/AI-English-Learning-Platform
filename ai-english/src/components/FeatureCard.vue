<template>
  <div
    class="feature-card group relative h-96 w-96 max-sm:w-80 max-[325px]:w-72 overflow-hidden rounded-xl border border-opacity-20 p-6 hover:scale-[1.02]"
    :style="{
      'background-color': 'var(--card-bg)',
      'border-color': 'var(--border-primary-1)',
    }"
    @click="onCardClickHandler"
  >
    <!-- 背景装饰元素 -->
    <div
      class="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-10 duration-500 group-hover:scale-150"
      :style="{ 'background-color': color }"
    ></div>
    
    <div class="relative z-10 flex h-full flex-col">
      <!-- 顶部内容 -->
      <div>
        <div
          class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-2xl"
          :style="{ 'background-color': color + '20', color: color }"
        >
          <slot name="icon"></slot>
        </div>
        
        <h3 class="mb-2 text-xl font-semibold" style="color: var(--title)">
          {{ title }}
        </h3>
        
        <p class="mb-4 text-sm" style="color: var(--content)">
          {{ description }}
        </p>
      </div>

      <!-- 扩充的底部内容 -->
      <div class="mt-auto">
        <!-- 功能亮点 -->
        <div class="mb-4 space-y-2">
          <div
            v-for="(feature, index) in features"
            :key="index"
            class="flex items-start text-sm"
            style="color: var(--content)"
          >
            <CheckCircle class="mr-2 mt-0.5 h-4 w-4 flex-shrink-0" :style="{ color: color }" />
            <span>{{ feature }}</span>
          </div>
        </div>
        
        <!-- 使用统计/热门程度 -->
        <div
          class="mb-4 flex items-center justify-between rounded-lg px-3 py-2 text-xs"
          :style="{ 'background-color': 'var(--accent-bg)' }"
        >
          <span class="text-title">本周使用次数</span>
          <span class="font-medium" :style="{ color: color }">{{ usageCount.toLocaleString() }}+</span>
        </div>
        
        <!-- 操作按钮 -->
        <button
          class="flex w-full items-center justify-center rounded-lg py-2 text-sm font-medium hover:opacity-90"
          :style="{
            'background-color': color,
            color: 'white',
          }"
        >
          立即体验
          <ArrowRight class="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import router from '@/router'
import { startViewTransition } from '@/utils';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  toPath: {
    type: String,
    required: true
  },
  features: {
    type: Array as () => string[],
    required: true,
  },
  usageCount: {
    type: Number,
    required: true,
  },
})

const onCardClickHandler = () => {
  document.documentElement.className = 'page-transition'
  startViewTransition(() => {
    router.push(props.toPath)
  }, () => {
    document.documentElement.className = ''
  })
}


</script>

<style scoped>
.feature-card {
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px);
}
</style>