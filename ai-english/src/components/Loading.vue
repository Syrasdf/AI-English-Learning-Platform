<template>
  <div ref="lottieContainer" :style="{
    width: size,
    height: size,
  }">
    
  </div>
</template>

<script setup lang="ts">
import Lottie from 'lottie-web';
import { onMounted, ref } from 'vue';
import LottieJsonLight from '@/assets/json/loading.json'; // Replace with your animation data

defineProps({
  size: {
    type: String,
    default: '3rem'
  }
});

const lottieContainer = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!lottieContainer.value) return; // Ensure the container is available
  Lottie.loadAnimation({
    container: lottieContainer.value,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: LottieJsonLight // Replace with your animation data
  });
});
</script>

<style scoped>

</style>