<template>
  <button
    @click="handleClick"
    class="relative p-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    aria-label="收藏"
    :disabled="disabled"
  >
    <!-- 背景圆圈（动画用） -->
    <div
      v-if="showRipple"
      class="absolute inset-0 rounded-full opacity-0 scale-0"
      :class="{
        'animate-ripple': showRipple,
        [rippleColor]: true,
      }"
    ></div>
    
    <!-- 星星图标 -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="transition-all duration-300"
      :class="[
        iconSize,
        {
          [activeColor]: isFavoriteModel,
          [inactiveColor]: !isFavoriteModel,
          'scale-110': isFavoriteModel && scaleOnActive,
        }
      ]"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
    
    <!-- 优化后的小星星粒子效果 -->
    <template v-if="showParticles && particleEffect">
      <div
        v-for="(particle, index) in particles"
        :key="index"
        class="absolute rounded-full"
        :class="particleColor"
        :style="{
          left: particle.x + 'px',
          top: particle.y + 'px',
          width: particleSize + 'px',
          height: particleSize + 'px',
          transform: `translate(${particle.offsetX}px, ${particle.offsetY}px) scale(${particle.scale})`,
          opacity: particle.opacity,
          transition: `transform ${particle.duration}ms ease-out, opacity ${particle.duration}ms ease-out`
        }"
      ></div>
    </template>
  </button>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';

interface Particle {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  scale: number;
  opacity: number;
  duration: number;
}

const props = withDefaults(defineProps<{
  modelValue: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  activeColor?: string;
  inactiveColor?: string;
  rippleColor?: string;
  particleColor?: string;
  particleSize?: number;
  particleEffect?: boolean;
  scaleOnActive?: boolean;
  particleCount?: number;
}>(), {
  modelValue: false,
  disabled: false,
  size: 'md',
  activeColor: 'fill-[#0ea5e9] stroke-[#0284c7]',
  inactiveColor: 'fill-transparent stroke-gray-400',
  rippleColor: 'bg-[#bae6fd]',
  particleColor: 'bg-[#38bdf8]',
  particleSize: 4,
  particleEffect: true,
  scaleOnActive: true,
  particleCount: 12,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'change', value: boolean): void;
}>();

const isFavoriteModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const showRipple = ref(false);
const showParticles = ref(false);
const particles = reactive<Particle[]>([]);

const iconSize = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-5 h-5';
    case 'lg': return 'w-8 h-8';
    default: return 'w-6 h-6';
  }
});

const handleClick = () => {
  if (props.disabled) return;
  
  const newValue = !isFavoriteModel.value;
  isFavoriteModel.value = newValue;
  emit('change', newValue);
  
  // 涟漪效果
  showRipple.value = true;
  setTimeout(() => {
    showRipple.value = false;
  }, 600);
  
  // 粒子效果
  if (newValue && props.particleEffect) {
    createParticles();
    showParticles.value = true;
    
    // 平滑消失效果
    setTimeout(() => {
      particles.forEach(p => {
        p.opacity = 0;
        p.offsetX *= 1.2;
        p.offsetY *= 1.2;
      });
    }, 300);
    
    setTimeout(() => {
      showParticles.value = false;
    }, 800);
  }
};

const createParticles = () => {
  particles.length = 0;
  
  const centerX = props.size === 'sm' ? 10 : props.size === 'lg' ? 16 : 12;
  const centerY = centerX;
  
  for (let i = 0; i < props.particleCount; i++) {
    const angle = (i / props.particleCount) * Math.PI * 2;
    const distance = 8 + Math.random() * 8;
    const duration = 600 + Math.random() * 400;
    
    particles.push({
      x: centerX,
      y: centerY,
      offsetX: 0,
      offsetY: 0,
      scale: 0.3 + Math.random() * 0.7,
      opacity: 0,
      duration
    });
    
    // 使用requestAnimationFrame实现平滑出现
    requestAnimationFrame(() => {
      const particle = particles[i];
      if (particle) {
        particle.offsetX = Math.cos(angle) * distance;
        particle.offsetY = Math.sin(angle) * distance;
        particle.opacity = 0.8 + Math.random() * 0.2;
      }
    });
  }
};

watch(() => props.modelValue, (newVal) => {
  if (newVal && props.particleEffect) {
    createParticles();
    showParticles.value = true;
    
    setTimeout(() => {
      particles.forEach(p => {
        p.opacity = 0;
        p.offsetX *= 1.2;
        p.offsetY *= 1.2;
      });
    }, 300);
    
    setTimeout(() => {
      showParticles.value = false;
    }, 800);
  }
});
</script>

<style>
@keyframes ripple {
  0% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

.animate-ripple {
  animation: ripple 0.6s ease-out forwards;
}
</style>