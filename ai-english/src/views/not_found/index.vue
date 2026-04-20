<template>
  <div class="flex justify-center items-center h-[100vh]">
    <div>
      <h1 class="text-title text-7xl font-shuhei">404</h1>
      <p class="text-content font-shuhei text-xl">似乎来到了没有知识的荒漠</p>
      <Button @click="back2HomeClickHandler">回到首页</Button>
    </div>
    <div ref="lottie-container"></div>
  </div>
  <div></div>
</template>

<script setup lang="ts">
import Lottie from 'lottie-web'
import { onMounted, useTemplateRef, watch } from 'vue'
import LottieJsonLight from '@/assets/json/404_lottie_light.json'
import LottieJsonDark from '@/assets/json/404_lottie_dark.json'

import { themeStore } from '@/store'

import Button from '@/components/Button.vue'
import router from '@/router'

const lottieContainer = useTemplateRef('lottie-container')
let lottieName = ''

const back2HomeClickHandler = () => {
  router.replace('/home')
}

onMounted(() => {
  const animationItem = Lottie.loadAnimation({
    container: lottieContainer.value!,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData:
      themeStore.theme === 'light' ? LottieJsonLight : LottieJsonDark
  })
  lottieName = animationItem.name
})

watch(
  () => themeStore.theme,
  () => {
    Lottie.destroy(lottieName)
    const animationItem = Lottie.loadAnimation({
      container: lottieContainer.value!,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData:
        themeStore.theme === 'light' ? LottieJsonLight : LottieJsonDark
    })
    lottieName = animationItem.name
  }
)
</script>

<style scoped></style>
