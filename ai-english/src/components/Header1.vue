<template>
  <header
    class="flex px-10 max-sm:px-4 justify-between h-16 sticky top-0 z-40 w-full backdrop-blur flex-none lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/75 supports-backdrop-blur:bg-white/95 dark:bg-slate-900/75"
  >
    <div class="flex items-center gap-3">
      <div
        class="hidden max-sm:block"
        v-if="route.name === 'ai对话'"
        @click="onExpandClickHandler"
      >
        <SvgIcon name="expand" size="1.5rem"></SvgIcon>
      </div>
      <div
        class="flex items-center font-shuhei text-title text-2xl max-sm:text-xl gap-1 cursor-pointer"
        @click="logoClickHandler"
      >
        <img :src="logo" class="h-8 w-16 max-sm:h-6 max-sm:w-12" alt="" />
        <div>AIEnglish</div>
      </div>
    </div>
    <div></div>
    <div class="flex items-center gap-4">
      <div class="font-shuhei cursor-pointer hover:text-active text-title" @click="onProfileClickHandler">
        个人中心
      </div>
      <Switch
        class="switch-btn"
        v-model:checked="isLight"
        @click="switchClickHandler"
      >
        <template #checkedChildren>
          <img class="w-[12px] h-[22px] block" :src="lightIcon" />
        </template>
        <template #unCheckedChildren>
          <img class="w-[12px] h-[22px] block" :src="darkIcon" />
        </template>
      </Switch>
    </div>
  </header>
</template>

<script setup lang="ts">
import logo from '@/assets/images/logo.png'
import { isLight } from '@/store/modules/themeStore'
import { Switch } from 'ant-design-vue'
import lightIcon from '@/assets/svg/light.svg'
import darkIcon from '@/assets/svg/dark.svg'
import router from '@/router'
import { startViewTransition } from '@/utils'
import SvgIcon from './SvgIcon.vue'
import { useRoute } from 'vue-router'
import { globalStore } from '@/store'

const route = useRoute()

const onExpandClickHandler = () => {
  globalStore.isOpenDialogDrawer = true
}

const switchClickHandler = (checked: any, e: any) => {
  const dom: HTMLDivElement = document.querySelector('.app-container')!
  dom.style.height = '100vh'
  dom.style.overflow = 'hidden'
  document.documentElement.style.setProperty('--x', e.clientX + 'px')
  document.documentElement.style.setProperty('--y', e.clientY + 'px')
}

const logoClickHandler = () => {
  document.documentElement.className = 'page-transition'
  startViewTransition(
    () => {
      router.push('/home')
    },
    () => {
      document.documentElement.className = ''
    }
  )
}

const onProfileClickHandler = ()=>{
  document.documentElement.className = 'page-transition'
  startViewTransition(
    () => {
      router.push('/profile')
    },
    () => {
      document.documentElement.className = ''
    }
  )
}
</script>

<style scoped lang="less">
.switch-btn {
  background-color: #0ea5e9;

  &:hover {
    background-color: #36bff5;
  }
}

:deep(.ant-switch-checked) {
  background-color: rgba(0, 0, 0, 0.25);

  &:hover {
    background-color: rgba(0, 0, 0, 0.5) !important;
  }
}
</style>
