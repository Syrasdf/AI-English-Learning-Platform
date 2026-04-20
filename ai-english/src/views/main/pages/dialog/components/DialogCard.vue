<template>
  <div ref="dialog-item-container" class="relative">
    <div v-if="data.role === 'assistant'" class="flex w-full justify-start">
      <div class="max-w-full">
        <div
          class="p-3 bg-dialog-bg text-title rounded-lg w-full border border-border-primary-1 shadow-dialog-shadow-light dark:shadow-dialog-shadow-dark"
          v-html="data.content"
        ></div>
        <div class="flex gap-2 items-center py-1 text-title justify-start">
          <div
            class="cursor-pointer"
            v-for="item in featureList"
            @click="item.handler"
          >
            <component :is="item.icon"></component>
          </div>
        </div>
      </div>
    </div>
    <div v-if="data.role === 'user'" class="flex w-full justify-end">
      <div class="max-w-full">
        <div
          class="p-3 bg-dialog-bg text-title rounded-lg w-full border border-border-primary-1 shadow-dialog-shadow-light dark:shadow-dialog-shadow-dark"
        >
          {{ data.content }}
        </div>
        <div class="flex gap-2 items-center py-1 text-title justify-end">
          <div
            class="cursor-pointer"
            v-for="item in featureList"
            @click="item.handler"
          >
            <component :is="item.icon"></component>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { computed, useTemplateRef, watch } from 'vue'
import { CopyOutlined, RedoOutlined } from '@ant-design/icons-vue'
import { message as AntdMessage } from 'ant-design-vue'

const props = defineProps<{
  data: ChatCompletionMessageParam
  model?: 'qwen-plus' | 'qwen-max' | 'deepseek-r1' | 'deepseek-v3'
  isTail?: boolean
  rawContent?: string // 原生字符串
}>()

const container = useTemplateRef<HTMLDivElement>('dialog-item-container')
const clipboard = useClipboard({
  legacy: true
})

const featureList = computed(() => {
  if (props.isTail && props.data.role === 'assistant') {
    return [
      {
        icon: CopyOutlined,
        handler: () => {
          AntdMessage.success('已复制到剪切板', 3)
          clipboard.copy(props.rawContent as string)
        }
      },
      {
        icon: RedoOutlined,
        handler: () => {}
      }
    ]
  } else {
    return [
      {
        icon: CopyOutlined,
        handler: () => {
          AntdMessage.success('已复制到剪切板', 3)
          clipboard.copy(props.rawContent as string)
        }
      }
    ]
  }
})

watch(
  () => props.data.content,
  () => {
    if (!props.isTail) return
    container.value?.scrollIntoView({
      behavior: 'smooth'
    })
  }
)
</script>

<style scoped></style>
