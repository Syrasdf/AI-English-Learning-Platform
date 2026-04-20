<template>
  <VoiceDialog v-if="mode"></VoiceDialog>
  <ChatDialog v-else></ChatDialog>
</template>

<script setup lang="ts">
import {
  ref,
  watch,
} from 'vue'

import { useRoute, useRouter } from 'vue-router'
import VoiceDialog from './components/VoiceDialog.vue'
import ChatDialog from './components/ChatDialog.vue'
import {globalStore} from '@/store'

const route = useRoute()

const mode = ref(false) // false文字对话,true语音对话
if(route.query.mode==='0'||route.query.mode===undefined){
  mode.value = false
}else{
  mode.value = true
}



watch(()=>route.query.mode,()=>{
  mode.value = !mode.value
})
</script>

<style scoped lang="less"></style>
