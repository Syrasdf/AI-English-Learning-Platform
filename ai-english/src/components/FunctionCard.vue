<template>
  <div
    class="w-1/3 h-80 box-border p-1 cursor-pointer max-sm:w-full max-lg:w-1/2"
    @click="cardClickHandler"
  >
    <div class="relative overflow-hidden w-full h-full">
      <div
        class="inset-[4px] bg-card-bg absolute rounded-md border dark:border-[#1a1a1a]"
      >
        <h2
          class="flex gap-2 items-center text-2xl px-2 text-title font-shuhei justify-start mt-2"
        >
          <svg-icon :name="cardData.icon" size="1.875rem"></svg-icon>
          {{ cardData.name }}
        </h2>
        <div>
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { startViewTransition } from '@/utils';

const props = defineProps<{
  cardData: {
    name: string
    icon: string
    toPath: string
  }
}>()

const cardClickHandler = () => {
  document.documentElement.className = 'page-transition'
  startViewTransition(()=>{
    router.push(props.cardData.toPath)
  },()=>{
    document.documentElement.className = ''
  })
}
</script>

<style scoped></style>
