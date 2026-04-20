<template>
  <div class="h-full box-border px-4 py-4 overflow-y-auto" ref="articleWrapper">
    <div class="w-full box-border flex" ref="waterFallContainer">
      <div
        :class="[cardWidth]"
        class="box-border px-3 max-2xl:px-2 h-fit flex flex-col gap-5"
        v-for="itemList in articleList"
      >
        <TransitionGroup @enter="onEnter">
          <div
            class="w-full rounded-2xl overflow-hidden text-title dark:text-slate-300 cursor-pointer"
            v-for="item in itemList"
            :key="item.id"
            @click="e => onArticleItemClickHandler(item, e)"
          >
            <div
              class="rounded-2xl overflow-hidden flex relative after:absolute after:inset-0 after:hover:bg-black/40 after:transition-all"
            >
              <img :src="item.coverImage" class="article-cover-image w-full" />
            </div>
            <div class="w-full p-2">
              <div
                class="article-title line-clamp-2 font-shuhei text-[18px] break-all"
                :title="item.title"
              >
                {{ item.title }}
              </div>
              <div class="article-content line-clamp-2 mt-1">
                {{ item.rawContent }}
              </div>
            </div>
            <div class="w-full px-2 flex items-center justify-between">
              <div class="article-user flex items-center gap-1">
                <Avatar :url="item.user.avatar" class="w-5 h-5 rounded-full" />
                <span class="text-accent-text">{{ item.user.username }}</span>
              </div>
              <div class="flex items-center gap-1">
                <EyeOutlined class="text-lg" />
                <span class="text-accent-text">{{ item.views }}</span>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
    <div class="w-full flex items-center justify-center" v-if="isLoading">
      <Loading size="4rem" v-if="isLoading" />
    </div>
    <div
      class="w-full font-shuhei py-2 flex items-center justify-center text-title"
      v-else-if="isNone"
    >
      没有更多了
    </div>
    <div class="w-[14.28%] w-[16.67%]"></div>
  </div>
</template>

<script setup lang="ts">
import { reqAddArticleView, reqGetArticle } from '@/api/article'
import type { ArticleData } from '@/api/types'
import {
  computed,
  nextTick,
  onActivated,
  onMounted,
  onUnmounted,
  ref,
  useTemplateRef
} from 'vue'
import { EyeOutlined } from '@ant-design/icons-vue'
import Loading from '@/components/Loading.vue'
import Avatar from '@/components/Avatar.vue'
import { useDebounceFn } from '@vueuse/core'
import { useRoute, useRouter } from 'vue-router'
import { globalStore } from '@/store'
import { startViewTransition } from '@/utils'
import gsap from 'gsap'

defineOptions({
  name: 'ArticleList'
})

const waterFallContainer = useTemplateRef<HTMLDivElement>('waterFallContainer')
const articleWrapper = useTemplateRef<HTMLDivElement>('articleWrapper')
const router = useRouter()
const route = useRoute()

const isGenerate = ref(false)
const articleData = ref({
  keyWord: null,
  pageNum: 1,
  pageSize: 10,
  state: null,
  deleteFlag: null as any
})
const articleList = ref<ArticleData[][]>([])

const isLoading = ref(false)
const isNone = ref(false)

const innerWidthRef = ref(innerWidth)

const columnCount = computed(() => {
  return innerWidthRef.value < 420
    ? 1
    : innerWidthRef.value < 640
    ? 2
    : innerWidthRef.value < 1024
    ? 4
    : innerWidthRef.value < 1280
    ? 5
    : innerWidthRef.value < 1536
    ? 6
    : 6
})
const cardWidth = computed(() => {
  return innerWidthRef.value < 420
    ? 'w-full'
    : innerWidthRef.value < 640
    ? 'w-1/2'
    : innerWidthRef.value < 1024
    ? 'w-1/4'
    : innerWidthRef.value < 1280
    ? 'w-1/5'
    : innerWidthRef.value < 1536
    ? 'w-[16.67%]'
    : 'w-[16.67%]'
})

const onArticleItemClickHandler = (item: ArticleData, e: MouseEvent) => {
  if(isGenerate.value){
    return
  }
  globalStore.activeArticle = item

  reqAddArticleView(item.id).then(res => {
    if (res.code === 200) {
      item.views++
    } else {
      console.error('增加浏览量失败')
    }
  })

  const dom = e.currentTarget as HTMLDivElement
  ;(
    dom.querySelector('.article-cover-image') as HTMLImageElement
  ).classList.add('cover-image-transition')
  ;(dom.querySelector('.article-title') as HTMLDivElement).classList.add(
    'article-title-transition'
  )
  ;(dom.querySelector('.article-content') as HTMLDivElement).classList.add(
    'article-content-transition'
  )
  ;(dom.querySelector('.article-user') as HTMLDivElement).classList.add(
    'article-user-transition'
  )
  startViewTransition(
    () => {
      router.push(`/article/${item.id}`)
    },
    () => {
      ;(
        dom.querySelector('.article-cover-image') as HTMLImageElement
      ).classList.remove('cover-image-transition')
      ;(dom.querySelector('.article-title') as HTMLDivElement).classList.remove(
        'article-title-transition'
      )
      ;(
        dom.querySelector('.article-content') as HTMLDivElement
      ).classList.remove('article-content-transition')
      ;(dom.querySelector('.article-user') as HTMLDivElement).classList.remove(
        'article-user-transition'
      )
    }
  )
}

function onEnter(el: any, done: any) {
  gsap
    .fromTo(
      el,
      {
        opacity: 0,
        transform: `translateY(20px)`
      },
      {
        opacity: 1,
        transform: `translateY(0px)`
      }
    )
    .duration(0.5)
}

const getArticleList = async () => {
  if (articleData.value.pageNum === 1) {
    articleList.value = []
    isNone.value = false
  }
  if (isNone.value) {
    return
  }
  isLoading.value = true
  isLoading.value = true
  try {
    articleData.value.pageSize = columnCount.value * 3
    const res = await reqGetArticle(articleData.value)
    if (!res.data?.records) {
      return
    }

    const records = res.data?.records
    records.forEach(item => {
      const div = document.createElement('div')
      div.innerHTML = item.content
      item.rawContent = div.textContent || ''
    })

    if (articleData.value.pageNum === 1) {
      for (let index = 0; index < records.length; index++) {
        const item = records[index]
        if (index < columnCount.value) {
          articleList.value[index] = [item]
        } else {
          // await nextTick()
          await new Promise((resolve, reject) => {
            setTimeout(resolve, 100)
          })
          let min = 999999
          let minIndex = 0
          for (let i = 0; i < waterFallContainer.value!.children.length; i++) {
            const children: HTMLDivElement = waterFallContainer.value!.children[
              i
            ] as any
            const height = children.getBoundingClientRect().height

            if (height < min) {
              min = height
              minIndex = i
            }
          }
          articleList.value[minIndex].push(item)
        }
      }
    } else {
      for (let index = 0; index < records.length; index++) {
        const item = records[index]
        // await nextTick()
        await new Promise((resolve, reject) => {
          setTimeout(resolve, 50)
        })
        let min = 999999
        let minIndex = 0
        for (let i = 0; i < waterFallContainer.value!.children.length; i++) {
          const children: HTMLDivElement = waterFallContainer.value!.children[
            i
          ] as any
          const height = children.getBoundingClientRect().height

          if (height < min) {
            min = height
            minIndex = i
          }
        }
        articleList.value[minIndex].push(item)
      }
    }
    articleData.value.pageNum++
    if (res.data?.records.length < articleData.value.pageSize) {
      isNone.value = true
    } else {
      isNone.value = false
    }
  } finally {
    isGenerate.value = false
    isLoading.value = false
  }

  setTimeout(() => {
    if (route.name === '英语文章') {
      if (
        articleWrapper.value!.scrollHeight -
          articleWrapper.value!.clientHeight <
        100
      ) {
        getArticleList()
      }
    }
  }, 1000)
}

getArticleList()

const onScrollHandler = useDebounceFn(() => {
  globalStore.scrollTop = articleWrapper.value?.scrollTop || 0
  if (!articleWrapper.value) return
  const bottom =
    articleWrapper.value?.scrollHeight -
    (articleWrapper.value?.scrollTop + articleWrapper.value?.clientHeight)
  if (bottom < 100) {
    getArticleList()
  }
}, 100)

const onResizeHandler = useDebounceFn(async () => {
  innerWidthRef.value = innerWidth
  const records = articleList.value.flat()
  articleList.value = []
  for (let index = 0; index < records.length; index++) {
    const item = records[index]
    if (index < columnCount.value) {
      articleList.value[index] = [item]
    } else {
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 50)
      })
      let min = 999999
      let minIndex = 0
      for (let i = 0; i < waterFallContainer.value!.children.length; i++) {
        const children: HTMLDivElement = waterFallContainer.value!.children[
          i
        ] as any
        const height = children.getBoundingClientRect().height
        if (height < min) {
          min = height
          minIndex = i
        }
      }
      articleList.value[minIndex].push(item)
    }
  }
}, 200)

onActivated(() => {
  articleWrapper.value!.scrollTop = globalStore.scrollTop
})

onMounted(() => {
  window.addEventListener('resize', onResizeHandler)
  articleWrapper.value?.addEventListener('scroll', onScrollHandler)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResizeHandler)
  articleWrapper.value?.removeEventListener('scroll', onScrollHandler)
  globalStore.scrollTop = 0
})
</script>

<style scoped></style>
