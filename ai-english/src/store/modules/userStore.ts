import type { UserInfoDataType } from '@/api/types'
import { getUserData } from '@/api/user'
import { reactive, watch } from 'vue'

export const userStore = reactive<{
  userInfo: UserInfoDataType | null
  token: string
}>({
  userInfo: null,
  token: localStorage.getItem('token') || ''
})

export const initUserData = () => {
  userStore.userInfo = null
  userStore.token = ''
  localStorage.removeItem('token')
}

watch(
  () => userStore.token,
  () => {
    if (userStore.token) {
      localStorage.setItem('token', userStore.token)
      getUserData().then(res => {
        if (res.code === 200) {
          userStore.userInfo = res.data!
        }
      })
    }
  }
)

export const logout = () => {
  initUserData()
}