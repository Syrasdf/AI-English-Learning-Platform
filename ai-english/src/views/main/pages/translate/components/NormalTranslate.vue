<template>
  <div
    class="w-full h-4/5 max-sm:h-full overflow-hidden bg-dialog-bg border border-border-primary-1 rounded-xl relative"
  >
    <div
      class="flex items-center h-full overflow-hidden max-sm:flex-col-reverse"
    >
      <!-- 输入区 -->
      <div class="flex flex-1 h-full flex-col w-full relative">
        <div class="p-2 flex justify-between items-center">
          <a-select v-model:value="domain" style="width: 120px">
            <a-select-option v-for="item in domainList" :value="item.value">{{
              item.tag
            }}</a-select-option>
          </a-select>
          <a-button
            class="mt-4 max-sm:mt-0 max-sm:block hidden text-button-primary-text bg-button-primary-bg border-none"
            @click="onTranslateClickHandler"
          >
            <div class="flex items-center gap-2">
              <SvgIcon
                will-change
                name="global"
                size="1.5rem"
                color="var(--button-primary-text)"
              ></SvgIcon>
              <div>翻译</div>
            </div>
          </a-button>
        </div>
        <div class="flex-1 pb-9">
          <a-textarea
            v-model:value="content"
            placeholder="请输入要翻译的文本"
            :auto-size="true"
            class="!h-full text-title max-sm:hidden placeholder:text-[#0f172a99] dark:placeholder:text-[#e2e8f099]"
            style="
              background: none;
              border: none;
              outline: none;
              box-shadow: none;
            "
            @change="onTextareaChangeHandler"
          />
          <a-textarea
            v-model:value="content"
            placeholder="请输入要翻译的文本"
            :auto-size="true"
            class="!h-full text-title hidden max-sm:block placeholder:text-[#0f172a99] dark:placeholder:text-[#e2e8f099]"
            style="
              background: none;
              border: none;
              outline: none;
              box-shadow: none;
            "
            @press-enter="onTextareaChangeHandler"
          />
        </div>
        <div class="flex gap-2 absolute bottom-4 left-4">
          <SoundOutlined
            @click="onSoundClickHandler(0, isCN2EN ? 0 : 1)"
            class="text-title text-lg cursor-pointer"
          ></SoundOutlined>
          <CopyOutlined
            @click="onCopyClickHandler(0)"
            class="text-title text-lg cursor-pointer"
          ></CopyOutlined>
        </div>
      </div>
      <!-- 中间线 -->
      <div
        class="h-4/5 w-[1px] max-sm:w-4/5 max-sm:h-[1px] bg-[#0f172a33] dark:bg-[#e2e8f099] relative select-none"
      ></div>
      <!-- 输出区 -->
      <div class="flex-1 h-full w-full text-title relative">
        <div class="pt-12 pb-9 p-2 h-full box-border break-all overflow-y-auto">
          {{ translateResult }}
        </div>
        <div class="flex gap-2 absolute bottom-4 left-4">
          <SoundOutlined
            @click="onSoundClickHandler(1, isCN2EN ? 1 : 0)"
            class="text-title text-lg cursor-pointer"
          ></SoundOutlined>
          <CopyOutlined
            @click="onCopyClickHandler(1)"
            class="text-title text-lg cursor-pointer"
          ></CopyOutlined>
        </div>
      </div>

      <!-- 中英文切换 -->
      <div
        ref="exchangeWrapper"
        class="flex font-shuhei items-center gap-2 text-title absolute top-2 left-1/2 max-sm:!left-[initial] -translate-x-1/2 max-sm:-translate-x-0 max-sm:top-0 max-sm:right-[12px] max-sm:h-12"
      >
        <div class="transition-transform text-center w-12 select-none">
          中文
        </div>
        <SvgIcon
          class="cursor-pointer"
          name="exchange"
          size="1.5rem"
          @click="onExchangeClickHandler"
        />
        <div class="transition-transform text-center w-12 select-none">
          英文
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import SvgIcon from '@/components/SvgIcon.vue'
import { getNormalTranslate } from '@/api/translate'
import { useClipboard, useDebounceFn } from '@vueuse/core'
import { CopyOutlined, SoundOutlined } from '@ant-design/icons-vue'
import {message as AntdMessage} from 'ant-design-vue'

const content = ref<string>('')
const domain = ref<string>('general')
const exchangeWrapper = useTemplateRef('exchangeWrapper')
const isCN2EN = ref(true)
const translateResult = ref('')

const domainList = [
  {
    value: 'general',
    tag: '通用场景'
  },
  {
    value: 'computers',
    tag: '计算机'
  },
  {
    value: 'medicine',
    tag: '医学'
  },
  {
    value: 'finance',
    tag: '金融经济'
  },
  {
    value: 'game',
    tag: '游戏'
  }
]

const onExchangeClickHandler = () => {
  isCN2EN.value = !isCN2EN.value
  const left: HTMLDivElement = exchangeWrapper.value
    ?.children[0]! as HTMLDivElement
  const center = exchangeWrapper.value?.children[1]!
  const right: HTMLDivElement = exchangeWrapper.value
    ?.children[2]! as HTMLDivElement

  const { left: preLeftXPos, top: preLeftYPos } = left.getBoundingClientRect()
  const { left: preRightXPos, top: preRightYPos } =
    right.getBoundingClientRect()
  exchangeWrapper.value?.insertBefore(right, center)
  exchangeWrapper.value?.appendChild(left)

  let x = preLeftXPos - preRightXPos
  let y = preLeftYPos - preRightYPos

  left.style.transform = `translate(${x}px,${y}px)`
  right.style.transform = `translate(${-x}px,${-y}px)`

  requestAnimationFrame(() => {
    left.style.removeProperty('transform')
    right.style.removeProperty('transform')
  })
}

const onTranslateClickHandler = async () => {
  if (!content.value.trim()) {
    return
  }
  const res = await getNormalTranslate(
    content.value,
    isCN2EN.value ? 'zh-CHS' : 'en',
    isCN2EN.value ? 'en' : 'zh-CHS',
    domain.value
  )
  if (res.code === 200) {
    translateResult.value = res.data?.translation!
  }
}

const onTextareaChangeHandler = useDebounceFn(async () => {
  if (!content.value.trim()) {
    return
  }
  const res = await getNormalTranslate(
    content.value,
    isCN2EN.value ? 'zh-CHS' : 'en',
    isCN2EN.value ? 'en' : 'zh-CHS',
    domain.value
  )
  if (res.code === 200) {
    translateResult.value = res.data?.translation!
  }
}, 500)
const synthesis = window?.speechSynthesis
synthesis?.getVoices()
const onSoundClickHandler = (index: number, type: number) => {
  const message = index === 0 ? content.value : translateResult.value
  const utterance = new SpeechSynthesisUtterance(message)
  if (type === 0) {
    utterance.voice =
      synthesis.getVoices().find(item => item.name.includes('Xiaoxiao')) ||
      synthesis.getVoices()[0]
  } else if (type === 1) {
    utterance.voice =
      synthesis.getVoices().find(item => item.name.includes('Jenny')) ||
      synthesis.getVoices()[0]
  }

  utterance.rate = 1
  utterance.pitch = 1

  if (!synthesis.speaking) {
    synthesis.speak(utterance)
  }
}

const clipboard = useClipboard({
  legacy: true
})
const onCopyClickHandler = async (type: number) => {
  try {
    if (type === 0) {
      await clipboard.copy(content.value)
    } else {
      await clipboard.copy(translateResult.value)
    }
    AntdMessage.success('复制成功',3)
  } catch {}
}
</script>

<style scoped>
:deep(.ant-select-selector) {
  background-color: transparent !important ;
  border: none !important;
  color: var(--title);
  box-shadow: none !important;
}

:deep(.ant-select-suffix) {
  color: var(--title);
}

:deep(.ant-select-open){
  .ant-select-selection-item{
    color: #ffffff66;
  }
}
</style>
