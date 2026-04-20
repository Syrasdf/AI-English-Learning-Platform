<template>
  <div class="flex h-[calc(100vh_-_4rem)]">
    <aside
      class="max-sm:w-0 flex-shrink-0 overflow-hidden transition-all duration-200 w-[12%] h-full flex flex-col px-10 max-sm:px-0 backdrop-blur lg:border-r lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/75 supports-backdrop-blur:bg-white/95 dark:bg-slate-900/75"
      v-if="route.name !== 'ai对话'"
    >
      <div
        v-for="(item, index) in functionList"
        @click="listItemClickHandler(item.toPath)"
        class="flex justify-center gap-3 py-3 font-deyi items-center cursor-pointer text-title"
      >
        <div class="w-6">
          <component :is="item.icon"/>
        </div>
        <div
          class="max-xl:hidden w-16"
          :class="{ 'text-active': currentIndex === index }"
        >
          {{ item.name }}
        </div>
      </div>
    </aside>
    <aside
      v-else-if="route.name === 'ai对话' && route.query.mode !== '1'"
      class="max-sm:dark:bg-slate-900 max-sm:bg-white max-sm:z-50 max-sm:w-[70vw] max-sm:absolute max-sm:top-0 max-sm:left-0 sm:min-w-32 lg:min-w-36 flex-shrink-0 overflow-hidden transition-all duration-200 w-[15%] h-full flex flex-col px-6 max-lg:px-4 max-sm:px-0 backdrop-blur lg:border-r lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/75 supports-backdrop-blur:bg-white/95 dark:bg-slate-900/75"
      :class="{
        'max-sm:-translate-x-full':!globalStore.isOpenDialogDrawer
      }"
    >
      <div class="w-full flex gap-2 items-center max-sm:mt-4 max-sm:flex max-sm:justify-end max-sm:gap-4 max-sm:pr-4">
        <a-button
          class="mt-4 max-sm:mt-0 max-sm:hidden w-full text-button-primary-text bg-button-primary-bg border-none"
          @click="onNewDialogClickHandler"
        >
          <div class="flex gap-2 items-center justify-center">
            <SvgIcon
              will-change
              name="new-dialog"
              color="var(--button-primary-text)"
            ></SvgIcon>
            <span class="max-sm:hidden">新对话</span>
          </div>
        </a-button>
        <SvgIcon
          class=" hidden max-sm:block"
          name="new-dialog"
          size="24px"
          color="var(--title)"
          @click="onNewDialogClickHandler"
        ></SvgIcon>
        <div class="max-sm:block hidden" @click="globalStore.isOpenDialogDrawer = false">
          <SvgIcon name="collapse" size="1.5rem"></SvgIcon>
        </div>
      </div>
      <div
        class="max-sm:mx-0 max-sm:px-2 mt-6 overflow-y-auto -mx-6 max-lg:-mx-4 px-3 max-lg:px-2"
      >
        <template v-for="(item1, index) in history">
          <div class="mb-5 text-title" v-if="item1.length">
            <div class="font-shuhei sticky top-0 mb-2 dark:bg-slate-900 bg-white">
              {{ timeMap[index] }}
            </div>
            <div
              @click="onDialogHistoryItemClickHandler(item2)"
              v-for="item2 in item1"
              :class="{
                '!bg-accent-active-bg':
                  globalStore.currentDialogId === item2.dialogId
              }"
              class="px-2 h-10 text-base/[2.5rem] w-full line-clamp-1 text-ellipsis cursor-pointer hover:bg-accent-bg rounded-lg"
            >
              {{ item2.dialogHistory }}
            </div>
          </div>
        </template>
      </div>
    </aside>
    <main class="flex-grow overflow-hidden">
      <router-view #default="{ Component }">
        <KeepAlive :max="1">
          <component :is="Component"></component>
        </KeepAlive>
      </router-view>
    </main>
    <Transition name="fade">
      <div v-show="globalStore.isOpenDialogDrawer" @click="globalStore.isOpenDialogDrawer = false" class="overlay fixed inset-0 bg-black/60 z-[45]"></div>
    </Transition>
    <div class="opacity-0 opacity-100"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { functionRoute } from '@/router/routes'
import router from '@/router'
import { useRoute } from 'vue-router'
import { getDialogHistroy, getDialogHistroyById } from '@/api'
import SvgIcon from '@/components/SvgIcon.vue'
import { globalStore, userStore } from '@/store'
import { getTimeStatus } from '@/utils'
import type { DialogHistroyResponseType } from '@/api/types'
import { initDialogContextList } from '@/store/modules/globalStore'
import { marked } from 'marked'
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
const route = useRoute()

const timeMap = ['今天', '昨天', '七天内', '更早以前']
const history = computed(() => {
  const arr: DialogHistroyResponseType[] = [[], [], [], []]
  globalStore.dialogHistory.forEach(item => {
    arr[getTimeStatus(item.createTime)].push(item)
  })
  return arr
})

const currentIndex = ref(-1)
const functionList = reactive(
  functionRoute.map(item => {
    return {
      name: item.name as string,
      toPath: item.path,
      icon: item.meta!.icon as string
    }
  })
)

const onNewDialogClickHandler = async () => {
  try {
    globalStore.isOpenDialogDrawer&&(globalStore.isOpenDialogDrawer = false)
    if (globalStore.dialogContextList.length === 1) {
      return
    }
    globalStore.currentDialogId = ''
    initDialogContextList()
  } catch {}
}

const onDialogHistoryItemClickHandler = async (
  item: DialogHistroyResponseType[number]
) => {
  if (item.dialogId === globalStore.currentDialogId) {
    return
  }

  try {
    globalStore.isShowDialog = false
    const res = await getDialogHistroyById(item.dialogId)
    globalStore.currentDialogId = res.data?.dialogId as string
    globalStore.rawContent = res.data!.dialogContent!.map(
      item => item.content
    ) as string[]
    globalStore.dialogContextList = res.data?.dialogContent.map(item => ({
      ...item,
      content:
        item.role === 'assistant'
          ? marked((item.content as string) || '')
          : item.content
    })) as ChatCompletionMessageParam[]
    nextTick(() => {
      globalStore.isShowDialog = true
    })
  } catch (e) {
    console.log(e)
  }
}

watch(
  () => route.name,
  () => {
    if (route.name === 'ai对话') {
      getDialogHistroy().then(res => {
        if (res.data?.length) {
          globalStore.dialogHistory = res.data
        }
      })
    }
    currentIndex.value = functionList.findIndex(
      item => item.name === route.name
    )
  },
  {
    immediate: true
  }
)

const listItemClickHandler = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.fade-enter-active,.fade-leave-active{
  transition: all 0.3s;
}

.fade-enter-from,.fade-leave-to{
  opacity: 0;
}

.fade-enter-to,.fade-leave-from{
  opacity: 1;
}
</style>
