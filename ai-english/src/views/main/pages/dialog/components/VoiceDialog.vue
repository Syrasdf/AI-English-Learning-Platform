<template>
  <div class="dialog-container p-4 h-full box-border relative">
    <div class="dialog-container-main rounded-xl w-full box-border h-full">
      <div class="h-[75%] w-full px-4 box-border overflow-y-auto">
        <div class="w-full h-full">
          <canvas id="canvas" class="bg-transparent"></canvas>
        </div>
      </div>
      <div class="h-[25%] p-4 flex flex-col gap-1 box-border">
        <div class="mt-auto"></div>
        <div class="flex justify-center items-center text-title">
          {{ userContent }}
        </div>
        <div class="flex justify-center items-center gap-4">
          <div
            @click="onModeSwitchClickHandler"
            class="h-10 cursor-pointer flex items-center justify-center px-3 py-1 rounded-full font-shuhei text-button-primary-text bg-button-primary-bg"
          >
            文字对话
          </div>
          <div
            @mousedown="onMouseDownHandler"
            @mouseup="onMouseUpHandler"
            @touchstart="onMouseDownHandler"
            @touchend="onMouseUpHandler"
            class="cursor-pointer select-none rounded-full flex items-center bg-button-primary-bg px-4 py-2 font-shuhei"
            :class="{
              'cursor-not-allowed': isAliceTalking
            }"
          >
            <SvgIcon
              name="voice"
              size="1.5rem"
              color="var(--button-primary-text)"
            ></SvgIcon>
            <div
              class="text-title flex items-center gap-2"
              v-show="!isUserTalking"
            >
              <div class="text-button-primary-text">按下说话</div>
            </div>
            <div
              class="text-title flex items-center gap-2"
              v-show="isUserTalking"
            >
              <div class="text-button-primary-text">正在说话</div>
              <Loader size="1rem"></Loader>
            </div>
          </div>
          <div
            class="p-2 cursor-pointer rounded-full flex-shrink-0 flex justify-center items-center bg-button-primary-bg"
            @click="onPlayClickHandler"
          >
            <SvgIcon
              name="play"
              size="1.5rem"
              color="var(--button-primary-text)"
            ></SvgIcon>
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/4 h-96 absolute left-20 top-1/2 -translate-y-1/2 max-sm:bottom-0 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:w-4/5 max-sm:h-20 max-sm:translate-y-[130%]">
      <div
        class="bg-dialog-bg overflow-y-auto h-full text-title px-5 py-4 rounded-lg shadow-voice-dialog-shadow-light dark:shadow-voice-dialog-shadow-dark"
        v-if="!isLoading && dialogContextList[dialogContextList.length - 1].role === 'assistant'"
      >
        {{ dialogContextList[dialogContextList.length - 1].content }}
      </div>
      <div
        v-show="isLoading"
        class="mx-auto w-1/2 gap-2 rounded-lg flex items-center justify-center py-3 bg-button-primary-bg text-button-primary-text"
      >
        <div>正在思考</div>
        <Loader size="1rem"></Loader>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
import { onMounted, ref, reactive } from 'vue'
import { marked } from 'marked'
import SvgIcon from '@/components/SvgIcon.vue'
import Loader from '@/components/Loader.vue'
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { getDialogContent, getDialogVoiceContent, getSpeechByText } from '@/api'
import { useRouter } from 'vue-router'
import type { theme } from 'ant-design-vue'
import { themeStore } from '@/store'

const router = useRouter()
const isUserTalking = ref(false)
const isAliceTalking = ref(false)
const userContent = ref()
let voiceMediaLink = 'http://127.0.0.1:3000/temp/init.wav'
const dialogContextList = reactive<ChatCompletionMessageParam[]>([
  {
    role: 'assistant',
    content: `Hello! How are you today? I'm Alice, your English teacher. It's nice to meet you.  Are you ready for some English conversation practice? Let me know if there is a specific topic you'd like to talk about!`
  }
])
const rawContent = reactive<string[]>([
  `Hello! How are you today? I'm Alice, your English teacher. It's nice to meet you.  Are you ready for some English conversation practice? Let me know if there is a specific topic you'd like to talk about!`
])

let cubism4Model = '/src/assets/kei_vowels_pro/kei_vowels_pro.model3.json'

let live2dModel = null

onMounted(() => {
  const live2d = PIXI.live2d
  console.log(live2d)

  const cvs = document.getElementById('canvas')
  // cvs?.parentElement?.clientWidth
  // cvs?.parentElement?.clientHeight

  ;(async function main() {
    const app = new PIXI.Application({
      view: document.getElementById('canvas'),
      // autoStart: true,
      width: cvs?.parentElement?.clientWidth,
      height: cvs?.parentElement?.clientHeight,
      transparent: true,
      // resizeTo: window,
      // backgroundColor: 'red'
      backgroundAlpha: 0
    })
    console.log(app)
    app.renderer.options.backgroundAlpha = 0

    const models = await Promise.all([live2d.Live2DModel.from(cubism4Model)])

    models.forEach(model => {
      app.stage.addChild(model)
      model.interactive = false
      const scaleX = innerWidth / model.width
      const scaleY = innerHeight / model.height

      // fit the window
      model.scale.set(Math.min(scaleX, scaleY))
      model.y = innerHeight * 0.1
      // draggable(model)
    })

    const model4 = models[0]
    live2dModel = model4

    const minLen = Math.min(
      cvs?.parentElement?.clientHeight,
      cvs?.parentElement?.clientWidth
    )

    model4.width = minLen
    model4.height = minLen

    model4.x = (cvs?.parentElement?.clientWidth - model4.width) / 2
    model4.y = cvs?.parentElement?.clientHeight - model4.height

    // 加载初始欢迎语音频，只更新链接不自动播放
    try {
      const res = await getSpeechByText(dialogContextList[0].content as string)
      if (res?.code === 200 && res?.data?.url) {
        voiceMediaLink = res.data.url
      }
    } catch (e) {
      console.error('初始语音加载失败', e)
    }

    // talk(live2dModel, import.meta.env.VITE_BASE_URL + '/temp/init.wav')
    // model4.on('hit', hitAreas => {
    //   if (hitAreas.includes('Body')) {
    //     model4.motion('Tap')
    //   }

    //   if (hitAreas.includes('Head')) {
    //     model4.expression()
    //   }
    // })

    // $('#play').click(function () {
    //   talk(model4, './demo.mp3')
    // })

    // $('#start').click(function () {
    //   console.log($('#text').val())
    //   let text = $('#text').val().trim()
    //   if (text == '') {
    //     alert('请输入内容')
    //     return false
    //   }
    //   $('#start').prop('disabled', true)
    //   axios
    //     .get(
    //       'http://127.0.0.1:2020/dealAudio?file_name=test.mp3&voice=xiaoxiao&text=' +
    //         text
    //     )
    //     .then(response => {
    //       console.log(response.data)
    //       const audioUrl = response.data + '?v=' + new Date().getTime()
    //       talk(model4, audioUrl)
    //       $('#start').prop('disabled', false)
    //     })
    //     .catch(error => {
    //       console.error('请求接口失败:', error)
    //       $('#start').prop('disabled', false)
    //     })
    // })
  })()
})

function talk(model, audio) {
  console.log('talk called, audio:', audio)
  if (!audio) return
  isAliceTalking.value = true
  const a = new Audio(audio)
  a.onended = () => { isAliceTalking.value = false }
  a.onerror = (e) => { 
    console.error('audio error:', e)
    isAliceTalking.value = false 
  }
  a.play().then(() => {
    console.log('audio playing')
  }).catch((e) => { 
    console.error('play failed:', e)
    isAliceTalking.value = false 
  })
}

// function draggable(model) {
//   model.buttonMode = true
//   model.on('pointerdown', e => {
//     model.dragging = true
//     model._pointerX = e.data.global.x - model.x
//     model._pointerY = e.data.global.y - model.y
//   })
//   model.on('pointermove', e => {
//     if (model.dragging) {
//       model.position.x = e.data.global.x - model._pointerX
//       model.position.y = e.data.global.y - model._pointerY
//     }
//   })
//   model.on('pointerupoutside', () => (model.dragging = false))
//   model.on('pointerup', () => (model.dragging = false))
// }

const synth = window.speechSynthesis

// Microsoft Xiaoxiao Online (Natural)

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition

const recognition = new SpeechRecognition()

let listening = false
const start = () => {
  if (listening) return
  listening = true
  try {
    recognition && recognition.start()
  } catch (e) {
    listening = false
  }
}
const stop = () => {
  listening = false
  try {
    recognition && recognition.stop()
  } catch (e) {}
}

const onResult = (event: any) => {
  console.log(event)

  for (const res of event.results) {
    const text = document.createTextNode(res[0].transcript)
    userContent.value = text.textContent
  }
  console.log(userContent.value)
}

recognition && (recognition.continuous = true)
recognition && (recognition.interimResults = true)
recognition && (recognition.lang = 'en-US')
recognition && recognition.addEventListener('result', onResult)
recognition && recognition.addEventListener('end', () => { listening = false })

const onMouseDownHandler = () => {
  if (isAliceTalking.value) return
  isUserTalking.value = true
  start()
}

const onMouseUpHandler = () => {
  if (isAliceTalking.value) return
  isUserTalking.value = false
  stop()
  // 等识别结束后再提交
  setTimeout(() => {
    submitUserContent()
  }, 500)
}
const onModeSwitchClickHandler = () => {
  router.push(`/content/dialog?mode=0`)
}

const onPlayClickHandler = () => {
  talk(live2dModel, voiceMediaLink)
}

const isLoading = ref(false)

const submitUserContent = async () => {
  if (!userContent.value) return
  isLoading.value = true
  userContent.value = userContent.value.replaceAll('。', '.')

  dialogContextList.push({
    role: 'user',
    content: userContent.value
  })
  console.log(dialogContextList)

  setTimeout(() => {
    userContent.value = ''
  })
  try {
    const res = await getDialogVoiceContent(dialogContextList)
    isLoading.value = false
    voiceMediaLink = res.data.url
    const index =
      dialogContextList.push({
        role: 'assistant',
        content: res.data.records
      }) - 1
    talk(live2dModel, res.data.url)
  } catch {
    isLoading.value = false
  }
}
</script>
