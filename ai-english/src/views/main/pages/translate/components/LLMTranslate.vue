<template>
  <div class="dialog-container p-4 h-full">
    <div class="dialog-container-main rounded-xl w-full h-full">
      <div class="h-[85%] px-4 box-border overflow-y-auto overflow-x-hidden">
        <div>
          <div class="w-full flex flex-col gap-3 mt-3">
            <div v-for="(item, index) in messageList" class="w-full">
              <template v-if="item.role === 'assistant'">
                <DialogCard
                  :data="item"
                  :key="index"
                  :raw-content="(item.content as string)||''"
                  :is-tail="messageList.length - 1 === index"
                />
              </template>
              <template v-if="item.role === 'user'">
                <DialogCard
                  :data="item"
                  :key="index"
                  :raw-content="globalStore.rawContent[index]"
                  :is-tail="messageList.length - 1 === index"
                />
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
            @click="onTextAreaEnterDownHandler"
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
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue'
import DialogCard from '@/views/main/pages/dialog/components/DialogCard.vue'
import { useRoute, useRouter } from 'vue-router'
import { globalStore } from '@/store'
// import { getLLMTranslate } from '@/api/translate'
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { ref } from 'vue'

const router = useRouter()
const route = useRoute()

const userContent = ref('') // 用户输入的内容
const messageList = ref<ChatCompletionMessageParam[]>([
  {
    role:'assistant',
    content:'你好,我是爱英语翻译助手,我可以帮您进行中英文的翻译.快来尝试吧!'
  }
])

const onTextAreaEnterDownHandler = async () => {
  messageList.value.push({
    role: 'user',
    content: userContent.value
  })
  const eventSource = new EventSource(
    `/api/common/translate/llm?word=${userContent.value}`
  )
  setTimeout(() => {
    userContent.value = ''
  })
  const index =
    messageList.value.push({
      role: 'assistant',
      content: ''
    }) - 1
  eventSource.addEventListener('message', e => {
    console.log(e)
    if (e.type === 'message') {
      messageList.value[index].content += JSON.parse(e.data)['transIncre']
    }
  })
}
</script>

<style scoped lang="less"></style>
