<template>
  <div class="dialog-container p-4 h-full">
    <div class="dialog-container-main rounded-xl w-full h-full">
      <div class="h-[85%] px-4 box-border overflow-y-auto overflow-x-hidden">
        <div>
          <div class="w-full flex flex-col gap-3 mt-3">
            <div
              v-for="(item, index) in globalStore.dialogContextList"
              class="w-full"
            >
              <template v-if="item.role === 'assistant'">
                <Transition
                  enter-active-class="animate__animated animate__fadeInLeft"
                >
                  <DialogCard
                    v-if="globalStore.isShowDialog"
                    :data="item"
                    :key="index"
                    :model="model"
                    :raw-content="globalStore.rawContent[index]"
                    :is-tail="
                      globalStore.dialogContextList.length - 1 === index
                    "
                  />
                </Transition>
              </template>
              <template v-if="item.role === 'user'">
                <Transition
                  enter-active-class="animate__animated animate__fadeInRight"
                >
                  <DialogCard
                    v-if="globalStore.isShowDialog"
                    :data="item"
                    :key="index"
                    :model="model"
                    :raw-content="globalStore.rawContent[index]"
                    :is-tail="
                      globalStore.dialogContextList.length - 1 === index
                    "
                  />
                </Transition>
              </template>
            </div>
            <div class="h-6"></div>
          </div>
        </div>
      </div>
      <div class="h-[15%] p-4 pt-0 flex flex-col gap-1 box-border relative">
        <!-- <div class="absolute -translate-y-full left-0 w-full h-5 backdrop-blur-sm"></div> -->
        <div class="mt-auto"></div>
        <div
          class="flex gap-2 absolute -translate-y-full w-full backdrop-blur-sm"
        >
          <a-select v-model:value="model" style="width: 150px">
            <a-select-option v-for="item in modelList" :value="item.value">
              <div class="flex items-center gap-2">
                <SvgIcon :name="item.icon"></SvgIcon>
                <div>{{ item.label }}</div>
              </div>
            </a-select-option>
          </a-select>
          <div
            @click="onModeSwitchClickHandler"
            class="cursor-pointer flex items-center justify-center px-2 py-1 rounded-[4px] font-shuhei text-button-primary-text bg-button-primary-bg"
          >
            语音对话
          </div>
          <div
            @click="onGenReportClickHandler"
            class="cursor-pointer flex items-center justify-center px-2 py-1 rounded-[4px] font-shuhei text-button-primary-text bg-button-primary-bg"
          >
            对话报告
          </div>
        </div>
        <div
          class="border border-button-primary-bg w-full rounded-lg flex gap-1 p-2"
        >
          <a-textarea
            class="text-base text-title"
            v-model:value="userContent"
            placeholder="请输入您的对话"
            :auto-size="{ minRows: 2, maxRows: 4 }"
            :bordered="false"
            :maxlength="1000"
            spellcheck="false"
            @press-enter="onTextAreaEnterDownHandler"
          />

          <div
            @click.stop="submitButtonClickHandler"
            class="w-12 h-12 mt-auto cursor-pointer rounded-full flex-shrink-0 flex justify-center items-center bg-button-primary-bg"
          >
            <SvgIcon
              name="plane"
              size="1.5rem"
              color="var(--button-primary-text)"
            ></SvgIcon>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="reportHtml"
        class="flex flex-col pb-16 items-center overflow-x-hidden fixed w-[100vw] h-[100vh] left-0 top-0 overflow-y-auto z-50 bg-black/40"
      >
        <div
          ref="wrapper"
          class="p-4 h-fit box-border w-[650px] max-sm:w-[100vw] bg-white"
          v-html="reportHtml"
        ></div>
        <div
          class="flex items-center gap-2 fixed bottom-4 left-1/2 -translate-x-1/2"
        >
          <a-button
            @click="onSaveAsImageClickHandler"
            class="bg-button-primary-bg !text-button-primary-text"
            >保存为图片</a-button
          >
          <a-button
            @click="onSaveAsMdClickHandler"
            class="bg-button-primary-bg !text-button-primary-text"
            >保存为markdown</a-button
          >
        </div>
        <div>
          <CloseOutlined
            @click="reportHtml = ''"
            class="absolute top-4 right-4 text-4xl text-slate-200 cursor-pointer"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { marked } from 'marked'
import html2Canvas from 'html2canvas'
import { CloseOutlined } from '@ant-design/icons-vue'
import {message as AntdMessage} from 'ant-design-vue'

import { getDialogContent, getNewDialogId, getReport } from '@/api'

import SvgIcon from '@/components/SvgIcon.vue'
import DialogCard from './DialogCard.vue'

import { useRoute, useRouter } from 'vue-router'
import { globalStore } from '@/store'

const router = useRouter()
const route = useRoute()

const wrapper = useTemplateRef<HTMLDivElement>('wrapper')
const reportHtml = ref('')
const reportRaw = ref('')

const userContent = ref('') // 用户输入的内容
const isTalking = ref(false)
const preKey = ref('')

const modelList = [
  {
    icon: 'qwen',
    label: 'qwen-max',
    value: 'qwen-max'
  },
  {
    icon: 'qwen',
    label: 'qwen-plus',
    value: 'qwen-plus'
  },
  {
    icon: 'deepseek',
    label: 'deepseek-r1',
    value: 'deepseek-r1'
  },
  {
    icon: 'deepseek',
    label: 'deepseek-v3',
    value: 'deepseek-chat'
  }
]
const model = ref<'qwen-plus' | 'qwen-max' | 'deepseek-r1' | 'deepseek-v3'>(
  'qwen-plus'
)

const onGenReportClickHandler = async () => {
  if(globalStore.dialogContextList.length < 6) {
    AntdMessage.info('对话内容过少，无法生成报告')
    return
  }
  
  try {
    const res = await getReport(globalStore.currentDialogId)
    const contentType = res.headers.get('Content-Type')
    if (contentType?.includes('json')) {
      const result = await res.json()
      reportHtml.value = marked(result.data) as string
      reportRaw.value = result.data
    } else {
      const reader = res.body?.getReader()!
      const decoder = new TextDecoder()
      let temp = ''
      while (true) {
        const { value, done } = await reader.read()
        if (done) {
          break
        }
        const chunk = decoder.decode(value)
        temp += chunk
        reportHtml.value = marked(temp) as string
      }
      reportRaw.value = temp
    }
  } catch (e) {
    console.log(e)
  }
}

const onSaveAsImageClickHandler = async () => {
  try {
    const canvas = await html2Canvas(wrapper.value!)
    canvas.toBlob(blob => {
      console.log(blob)

      if (!blob) {
        return
      }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = '对话报告.png'
      a.click()
      a.remove()
    })
  } catch (e) {
    console.error(e)
  }
}

const onSaveAsMdClickHandler = async () => {
  const blob = new Blob([reportRaw.value], {
    type: 'text/markdown'
  })
  if (!blob) {
    return
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '对话报告.md'
  a.click()
  a.remove()
}

const submitButtonClickHandler = async () => {
  if (globalStore.dialogContextList.length === 1) {
    // 说明此时之前是没有对话的,可以创建一条新对话
    await getNewId()
  }

  globalStore.dialogContextList.push({
    role: 'user',
    content: userContent.value
  })
  globalStore.rawContent.push(userContent.value)
  isTalking.value = true
  setTimeout(() => {
    userContent.value = ''
  })
  const res = await getDialogContent({
    dialogId: globalStore.currentDialogId,
    message: globalStore.dialogContextList.map((item, index) => ({
      ...item,
      content: globalStore.rawContent[index]
    }))
  })
  const reader = res.body!.getReader()
  const decoder = new TextDecoder()

  const index =
    globalStore.dialogContextList.push({
      role: 'assistant',
      content: ''
    }) - 1
  // 流式读取数据

  let tempNativeMsg: string = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value)
    tempNativeMsg += chunk
    globalStore.dialogContextList[index].content = marked(
      tempNativeMsg
    ) as string
  }
  globalStore.rawContent.push(tempNativeMsg)
  isTalking.value = false
}

const onTextAreaEnterDownHandler = () => {
  if (!userContent.value.trim()) {
      return
    }
    submitButtonClickHandler()
}

const onKeyDownHandler = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    return
  }
  preKey.value = e.key
}

const onModeSwitchClickHandler = () => {
  router.push(`/content/dialog?mode=1`)
}

const getNewId = async () => {
  try {
    const res = await getNewDialogId()
    globalStore.currentDialogId = res.data || ''
  } catch {
    return
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDownHandler)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDownHandler)
})
</script>

<style scoped lang="less"></style>
