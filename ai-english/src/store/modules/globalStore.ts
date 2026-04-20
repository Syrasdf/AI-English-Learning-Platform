import type { ArticleData, DialogHistroyResponseType } from '@/api/types'
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { reactive, watch, watchEffect } from 'vue'

export const globalStore = reactive<{
  isShowLogin: boolean
  currentDialogId: string
  dialogHistory: DialogHistroyResponseType
  dialogContextList: ChatCompletionMessageParam[]
  rawContent: string[],
  isShowDialog:boolean,
  isOpenDialogDrawer:boolean,
  scrollTop:number,
  activeArticle:ArticleData|null,
  isExpand:boolean
}>({
  isShowLogin: false,
  currentDialogId: localStorage.getItem('dialogId') || '',
  dialogHistory: [],
  dialogContextList: (localStorage.getItem('dialogContextList') &&
    JSON.parse(localStorage.getItem('dialogContextList') as string)) || [
    {
      role: 'assistant',
      content: `Hello! How are you today? I'm Alice, your English teacher. It's nice to meet you. 😊 Are you ready for some English conversation practice? Let me know if there is a specific topic you'd like to talk about!`
    }
  ],
  rawContent: (localStorage.getItem('rawContent') &&
    JSON.parse(localStorage.getItem('rawContent') as string)) || [
    `Hello! How are you today? I'm Alice, your English teacher. It's nice to meet you. 😊 Are you ready for some English conversation practice? Let me know if there is a specific topic you'd like to talk about!`
  ],
  isShowDialog:true,
  isOpenDialogDrawer:false,
  scrollTop:0,
  activeArticle:null,
  isExpand:false
})

export const initDialogContextList = () => {
  globalStore.dialogContextList = [
    {
      role: 'assistant',
      content: `Hello! How are you today? I'm Alice, your English teacher. It's nice to meet you. 😊 Are you ready for some English conversation practice? Let me know if there is a specific topic you'd like to talk about!`
    }
  ]
  globalStore.rawContent = [
    `Hello! How are you today? I'm Alice, your English teacher. It's nice to meet you. 😊 Are you ready for some English conversation practice? Let me know if there is a specific topic you'd like to talk about!`
  ]
}

export const initGlobalData = ()=>{
  initDialogContextList()
  globalStore.currentDialogId = ''
  localStorage.removeItem('dialogId')
}

watchEffect(()=>{
  localStorage.setItem(
    'dialogContextList',
    JSON.stringify(globalStore.dialogContextList)
  )
})

watchEffect(()=>{
  localStorage.setItem('rawContent', JSON.stringify(globalStore.rawContent))
})

watch(()=>globalStore.currentDialogId,()=>{
  localStorage.setItem('dialogId', globalStore.currentDialogId)
  // initDialogContextList()
})