<template>
  <config-provider
    :locale="zhCN"
    :theme="{
      token: {
        colorPrimary: '#0ea5e9',
      }
    }"
  >
    <div class="app-container bg-bg-100" :class="appContainerClassList">
      <router-view></router-view>
    </div>
    <LoginModal v-if="globalStore.isShowLogin"></LoginModal>
  </config-provider>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { ConfigProvider } from 'ant-design-vue'
import { appContainerClassList } from './store/modules/themeStore'
import LoginModal from './components/LoginModal.vue'
import { globalStore, userStore } from './store'
import { getUserData } from './api/user'

dayjs.locale('zh-cn')

if(userStore.token){
  getUserData().then(res=>{
    if(res.code===200){
      userStore.userInfo = res.data!
    }
})
}
</script>

<style lang="less">
.app-container {
  min-height: 100vh;
  background-position: bottom;
  background-repeat: no-repeat;
  &.app-container-light {
    background-image: url(./assets/images/bg_light.jpg);
    background-size: 150rem;
    background-repeat: repeat;
  }

  &.app-container-dark {
    background-image: url(./assets/images/bg_dark.jpg);
    background-size: 86.125rem;
    background-color: rgb(11 17 32);
    background-repeat: repeat
  }
}
</style>
