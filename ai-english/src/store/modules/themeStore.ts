import { setValueToLocalStorage, startViewTransition } from '@/utils'
import { computed, reactive, watchEffect } from 'vue'

export const themeStore = reactive<{
  theme: 'light' | 'dark'
  setTheme: (value: 'light' | 'dark', isStorage?: boolean) => void
  [p: string]: any
}>({
  theme: (localStorage.getItem('theme') as 'light' | 'dark' | null) || 'light',
  setTheme(value, isStorage = false) {
    isStorage && setValueToLocalStorage('theme', value)
    this.theme = value
  }
})

export const isLight = computed({
  get() {
    return themeStore.theme === 'light'
  },
  set(value) {
    value
      ? themeStore.setTheme('light', true)
      : themeStore.setTheme('dark', true)
  }
})

export const appContainerClassList = reactive([
  themeStore.theme === 'light' ? 'app-container-light' : 'app-container-dark'
])

// watch主题的改变进行相应的动画
watchEffect(() => {
  themeStore.theme
  appContainerClassList[1] = 'app-container-name'
  startViewTransition(
    () => {
      appContainerClassList[0] =
        themeStore.theme === 'light'
          ? 'app-container-light'
          : 'app-container-dark'
      document.documentElement.setAttribute('theme', themeStore.theme)
    },
    () => {
      appContainerClassList[1] = ''
      const dom:HTMLDivElement = document.querySelector('.app-container')!
      dom.style.removeProperty('height')
      dom.style.removeProperty('overflow')
    }
  )
})
