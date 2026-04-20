<template>
  <div
    class="translate-card-container rounded-xl overflow-hidden border border-solid bg-translate-card-bg"
    :style="{
      'border-color': 'var(--border-primary-1)'
    }"
  >
    <!-- 翻译前内容区域 -->
    <div
      class="p-4 border-b border-solid"
      :style="{
        'border-color': 'var(--border-primary-1)'
      }"
    >
      <div class="flex items-center mb-2">
        <span
          class="text-sm font-medium mr-2"
          :style="{ color: 'var(--title)' }"
        >
          原文
        </span>
        <span
          class="text-xs px-2 py-1 rounded"
          :style="{
            'background-color': 'var(--accent-bg)',
            color: 'var(--accent-text)'
          }"
        >
          {{ sourceLanguage }}
        </span>
      </div>
      <p class="text-sm leading-relaxed" :style="{ color: 'var(--content)' }">
        {{ sourceText }}
      </p>
    </div>

    <!-- 翻译后内容区域 -->
    <div class="p-4 relative">
      <div class="flex items-center mb-2">
        <span
          class="text-sm font-medium mr-2"
          :style="{ color: 'var(--title)' }"
        >
          译文
        </span>
        <span
          class="text-xs px-2 py-1 rounded"
          :style="{
            'background-color': 'var(--accent-bg)',
            color: 'var(--accent-text)'
          }"
        >
          {{ targetLanguage }}
        </span>
      </div>
      <p class="text-sm leading-relaxed" :style="{ color: 'var(--content)' }">
        {{ targetText }}
      </p>

      <div class="absolute right-3 top-3 flex space-x-2" v-if="showActions">
        <button
          class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-opacity-20 transition-colors"
          :style="{
            'background-color': 'var(--accent-bg)',
            color: 'var(--accent-text)'
          }"
          @click="$emit('copy', targetText)"
          title="复制译文"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path
              d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <div class="p-4 pt-0 relative" v-if="analysis" v-html="analysis">
    </div>
    <!-- 操作按钮 (可选) -->
    <div class="absolute right-3 top-3 flex space-x-2" v-if="showActions">
      <audio ref="audio" :src="audioSrc"></audio>
      <button
        class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-opacity-20 transition-colors"
        :style="{
          'background-color': 'var(--accent-bg)',
          color: 'var(--accent-text)'
        }"
        @click="onSpeakClickHandler"
        title="朗读"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 9V15H7L12 20V4L7 9H3Z" fill="currentColor" />
          <path
            d="M16.5 12C16.5 10.23 15.48 8.71 14 7.97V16.02C15.48 15.29 16.5 13.77 16.5 12Z"
            fill="currentColor"
          />
          <path
            d="M14 3.23V5.29C16.89 6.15 19 8.83 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.72 18.01 4.14 14 3.23Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <button
        class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-opacity-20 transition-colors"
        :style="{
          'background-color': 'var(--accent-bg)',
          color: 'var(--accent-text)'
        }"
        @click="$emit('copy', sourceText)"
        title="复制原文"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path
            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useTemplateRef } from 'vue'

const audio = useTemplateRef<HTMLAudioElement>('audio')

interface Props {
  sourceText: string
  targetText: string
  sourceLanguage?: string
  targetLanguage?: string
  showActions?: boolean
  analysis?:string,
  audioSrc?:string
}

withDefaults(defineProps<Props>(), {
  sourceLanguage: '中文',
  targetLanguage: '英文',
  showActions: true
})

defineEmits<{
  (e: 'copy', text: string): void,
  (e: 'speak', text: string): void
}>()

const onSpeakClickHandler = ()=>{
  audio.value?.play()
}
</script>
