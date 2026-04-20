<template>
  <div>
    <div
      v-if="articleDetail && articleDetail.coverImage"
      class="w-full h-[40vh] mb-6 bg-white dark:bg-black"
    >
      <img
        :src="articleDetail.coverImage"
        alt="封面图片"
        class="w-full h-full object-cover shadow-sm"
        style="view-transition-name: cover-image"
      />
    </div>
    <div
      class="article-detail-container p-6 max-w-4xl mx-auto bg-card-bg rounded shadow-md"
    >
      <div v-if="articleDetail" class="flex flex-col gap-6">
        <!-- 标题 -->
        <div
          ref="articleTitleRef"
          class="text-title text-3xl font-bold text-center font-shuhei"
          style="view-transition-name: article-title"
        >
          {{ articleDetail.title }}
        </div>

        <!-- 作者信息 -->
        <div
          style="view-transition-name: article-user"
          class="flex items-center gap-4 justify-between"
        >
          <div class="flex items-center gap-4">
            <Avatar
              :url="articleDetail.user.avatar"
              class="w-12 h-12 rounded-full border border-border-primary-1"
            />
            <div>
              <div class="text-content font-semibold">
                {{ articleDetail.user.username }}
              </div>
              <div class="text-sm text-gray-500">
                {{ formatDate(articleDetail.createTime) }}
              </div>
            </div>
          </div>

          <Collect
            v-if="userStore.userInfo"
            v-model="articleDetail.isCollect!"
            @change="onCollectChangeHandler"
          />
        </div>

        <!-- 内容 -->
        <div class="text-content text-lg">
          <div
            ref="articleContentRef"
            class="article-content-container"
            style="view-transition-name: article-content"
            v-html="articleDetail.content"
          ></div>
        </div>

        <!-- 统计信息 -->
        <div class="flex justify-between text-sm text-gray-500">
          <div>浏览量：{{ articleDetail.views }}</div>
          <div>评论数：{{ articleDetail.feedbackCount }}</div>
        </div>
      </div>

      <!-- 加载中 -->
      <div v-else class="text-center text-content text-lg font-medium">
        加载中...
      </div>
    </div>

    <!-- 评论区 -->
    <div class="comments-section max-w-4xl mx-auto mt-8 rounded-lg">
      <h2 class="text-title text-2xl font-bold mb-6">评论区</h2>

      <!-- 评论表单 -->
      <div class="mb-8">
        <a-textarea
          v-model:value="commentContent"
          placeholder="写下你的评论..."
          :rows="4"
          class="bg-card-bg text-content"
        />
        <div class="flex justify-end mt-2">
          <a-button
            type="primary"
            @click="submitComment"
            :loading="isSubmitting"
            class="!bg-button-primary-bg"
          >
            发表评论
          </a-button>
        </div>
      </div>

      <!-- 评论列表 -->
      <a-spin :spinning="isLoading">
        <a-empty
          v-if="!isLoading && comments.length === 0"
          description="暂无评论，来发表第一条评论吧！"
        />

        <div v-else class="space-y-6">
          <a-comment
            v-for="comment in rootComments"
            :key="comment.id"
            class="border border-border-primary-1 rounded-lg p-4 bg-card-bg comment-item"
          >
            <template #avatar>
              <Avatar
                :url="comment.user.avatar || ''"
                class="w-10 h-10 rounded-full border border-border-primary-1"
              />
            </template>

            <template #author>
              <span class="font-medium !text-accent-text">{{
                comment.user.username
              }}</span>
            </template>

            <template #time>
              <span class="text-sm text-gray-500">{{
                formatDate(comment.createTime)
              }}</span>
            </template>

            <template #content>
              <div class="text-content">{{ comment.content }}</div>
            </template>

            <template #actions>
              <a-button
                type="link"
                @click="showReplyForm(comment.id)"
                class="text-accent-text p-0 h-auto"
              >
                回复
              </a-button>
            </template>

            <!-- 回复表单 -->
            <div v-if="replyToId === comment.id" class="mt-3">
              <a-textarea
                v-model:value="replyContent"
                placeholder="回复评论..."
                :rows="3"
                class="bg-card-bg text-content"
              />
              <div class="flex justify-end gap-2 mt-2">
                <a-button @click="cancelReply"> 取消 </a-button>
                <a-button
                  type="primary"
                  @click="submitReply(comment.id)"
                  :loading="isSubmitting"
                  class="!bg-button-primary-bg"
                >
                  回复
                </a-button>
              </div>
            </div>

            <!-- 嵌套回复 -->
            <div
              v-if="getCommentReplies(comment.id).length > 0"
              class="mt-4 pl-4 border-l-2 border-border-primary-1 nested-comments"
            >
              <a-comment
                v-for="reply in getCommentReplies(comment.id)"
                :key="reply.id"
                class="bg-accent-bg bg-opacity-20 rounded-lg p-2 mb-2 reply-item"
              >
                <template #avatar>
                  <Avatar
                    :url="reply.user.avatar || ''"
                    class="w-8 h-8 rounded-full border border-border-primary-1"
                  />
                </template>

                <template #author>
                  <div class="flex items-center">
                    <span class="text-content font-medium text-sm text-title">{{
                      reply.user.username
                    }}</span>
                    <span
                      v-if="getReplyTarget(reply)"
                      class="text-xs text-gray-500 mx-1"
                      >回复</span
                    >
                    <span
                      v-if="getReplyTarget(reply)"
                      class="text-content text-xs font-medium"
                      >{{ getReplyTarget(reply)!.user.username }}</span
                    >
                  </div>
                </template>

                <template #time>
                  <span class="text-xs text-gray-500">{{
                    formatDate(reply.createTime)
                  }}</span>
                </template>

                <template #content>
                  <div class="text-content text-sm">{{ reply.content }}</div>
                </template>

                <template #actions>
                  <a-button
                    type="link"
                    @click="showReplyForm(reply.id)"
                    class="text-accent-text p-0 h-auto text-xs"
                  >
                    回复
                  </a-button>
                </template>

                <!-- 回复表单 -->
                <div v-if="replyToId === reply.id" class="mt-2">
                  <a-textarea
                    v-model:value="replyContent"
                    placeholder="回复评论..."
                    :rows="2"
                    class="bg-card-bg text-content text-sm"
                  />
                  <div class="flex justify-end gap-2 mt-1">
                    <a-button size="small" @click="cancelReply">
                      取消
                    </a-button>
                    <a-button
                      type="primary"
                      size="small"
                      @click="submitReply(reply.id)"
                      :loading="isSubmitting"
                      class="bg-button-primary-bg"
                    >
                      回复
                    </a-button>
                  </div>
                </div>
              </a-comment>
            </div>
          </a-comment>
        </div>
      </a-spin>
    </div>
  </div>

  <TranslateCard
    class="absolute max-w-96"
    :style="{
      top: cardPos.top + 'px',
      left: cardPos.left + 'px'
    }"
    v-show="translateContent"
    :sourceText="sourceContent"
    :sourceLanguage="'en-US'"
    :targetLanguage="'zh-CN'"
    :target-text="translateContent"
    :analysis="analysis"
    :audioSrc="audioSrc"
    @copy="onCopyClickHandler"
  />
</template>

<script setup lang="ts">
import { reqGetArticle } from '@/api/article'
import { reqGetFeedback, reqPostFeedback } from '@/api/feedback'
import type { ArticleData } from '@/api/types'
import { message as AntdMessage } from 'ant-design-vue'
import type { Feedback, FeedbackAddDataType } from '@/api/types/feedback'
import {
  onActivated,
  ref,
  computed,
  onMounted,
  onUnmounted,
  useTemplateRef,
  nextTick,
  reactive
} from 'vue'
import { useRoute } from 'vue-router'
import Avatar from '@/components/Avatar.vue'
import { globalStore, userStore } from '@/store'
import { useClipboard, useDebounceFn } from '@vueuse/core'
import TranslateCard from './components/TranslateCard.vue'
import { isMobileDevice } from '@/utils'
import Collect from '@/components/Collect.vue'
import { CollectType, reqDeleteCollect, reqPostCollect } from '@/api/collect'
import { getContentAnalysis, getSpeechByText } from '@/api'
import { marked } from 'marked'

defineOptions({
  name: 'ArticleDetail'
})

const articleTitleRef = useTemplateRef('articleTitleRef')
const articleContentRef = useTemplateRef('articleContentRef')

const route = useRoute()
const articleDetail = ref<ArticleData | null>(null)
const comments = ref<Feedback[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const commentContent = ref('')
const replyContent = ref('')
const replyToId = ref<string | null>(null)
const translateContent = ref('')
const analysis = ref('')
const sourceContent = ref('')
const isOutputing = ref(false)
const lastContent = ref('')
const cardPos = reactive({
  top: 0,
  left: 0
})
const isCollect = ref(true)
const audioSrc = ref('')

// 获取文章详情
const fetchArticleDetail = () => {
  const articleId = route.params.id as string

  if (globalStore.activeArticle) {
    articleDetail.value = globalStore.activeArticle
    fetchComments()
    reqGetArticle({
      id: articleId
    })
      .then(res => {
        if (res.code === 200 && res.data) {
          articleDetail.value!.isCollect = res.data.records[0].isCollect
        }
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    reqGetArticle({
      id: articleId
    })
      .then(res => {
        if (res.code === 200 && res.data) {
          articleDetail.value = res.data.records[0]
          fetchComments()
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}

// 获取评论
const fetchComments = () => {
  if (!articleDetail.value) return

  isLoading.value = true
  reqGetFeedback(articleDetail.value.id)
    .then(res => {
      if (res.code === 200 && res.data) {
        comments.value = res.data.records
      }
    })
    .catch(err => {
      console.log('获取评论失败:', err)
    })
    .finally(() => {
      isLoading.value = false
    })
}

// 获取根评论（没有父评论的评论）
const rootComments = computed(() => {
  return comments.value.filter(comment => !comment.parentId)
})

// 获取特定评论的所有回复（包括回复的回复）
const getCommentReplies = (rootId: string) => {
  // 创建一个映射来跟踪每个评论的父评论ID链
  const parentChain = new Map<string, string>()

  // 首先找出直接回复根评论的评论
  const directReplies = comments.value.filter(
    comment => comment.parentId === rootId
  )

  // 记录这些直接回复的ID，它们都属于根评论
  directReplies.forEach(reply => {
    parentChain.set(reply.id, rootId)
  })

  // 找出所有其他回复，并确定它们是否属于这个根评论的回复链
  const allReplies = [...directReplies]

  // 查找回复的回复
  let foundNew = true
  while (foundNew) {
    foundNew = false

    for (const comment of comments.value) {
      // 如果这个评论是回复某个评论，并且那个评论已经在我们的父链中
      if (
        comment.parentId &&
        parentChain.has(comment.parentId) &&
        !parentChain.has(comment.id)
      ) {
        // 将这个评论添加到结果中
        allReplies.push(comment)
        // 记录这个评论的父链
        parentChain.set(comment.id, comment.parentId)
        // 标记我们找到了新的回复
        foundNew = true
      }
    }
  }

  return allReplies
}

// 获取回复的目标评论
const getReplyTarget = (reply: Feedback) => {
  if (!reply.parentId) return null
  return comments.value.find(comment => comment.id === reply.parentId) || null
}

// 格式化日期
const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(date).toLocaleDateString('zh-CN', options)
}

// 提交评论
const submitComment = () => {
  if (!commentContent.value.trim() || !articleDetail.value) return

  isSubmitting.value = true
  const commentData: FeedbackAddDataType = {
    articleId: articleDetail.value.id,
    content: commentContent.value.trim()
  }

  reqPostFeedback(commentData)
    .then(res => {
      if (res.code === 200) {
        commentContent.value = ''
        fetchComments() // 重新获取评论列表
      }
    })
    .catch(err => {
      console.log('提交评论失败:', err)
    })
    .finally(() => {
      isSubmitting.value = false
    })
}

// 显示回复表单
const showReplyForm = (commentId: string) => {
  replyToId.value = commentId
  replyContent.value = ''
}

// 取消回复
const cancelReply = () => {
  replyToId.value = null
  replyContent.value = ''
}

// 提交回复
const submitReply = (parentId: string) => {
  if (!replyContent.value.trim() || !articleDetail.value) return

  isSubmitting.value = true
  const replyData: FeedbackAddDataType = {
    articleId: articleDetail.value.id,
    content: replyContent.value.trim(),
    parentId: parentId
  }

  reqPostFeedback(replyData)
    .then(res => {
      if (res.code === 200) {
        replyContent.value = ''
        replyToId.value = null
        fetchComments() // 重新获取评论列表
      }
    })
    .catch(err => {
      console.log('提交回复失败:', err)
    })
    .finally(() => {
      isSubmitting.value = false
    })
}

const onCopyClickHandler = (text:string)=>{
  useClipboard().copy(text)
}

const onSelectionChangeHandler = (e: Event) => {
  if (isOutputing.value) {
    return
  }
  const text = window.getSelection()?.toString()

  if (text && text?.length > 1000) {
    AntdMessage.error('选中的文本过长，请选择更短的文本')
    return
  }

  if (text === lastContent.value) {
    return
  }

  const rect = window.getSelection()?.getRangeAt(0).getBoundingClientRect()
  if (!(articleContentRef.value && articleTitleRef.value)) {
    return
  }
  if (
    getSelection()?.containsNode(articleContentRef.value, true) ||
    getSelection()?.containsNode(articleTitleRef.value, true)
  ) {
    if (!text?.trim()) {
      return
    }

    sourceContent.value = text || ''
    cardPos.top = rect ? rect.top + window.scrollY : 0
    cardPos.left = rect ? rect.left + window.scrollX : 0

    lastContent.value = text || ''
    const eventSource = new EventSource(
      `/api/common/translate/llm?word=${text}`
    )
    analysis.value = ''
    getContentAnalysis(text).then(async res => {
      const reader = res.body?.getReader()!
      const decoder = new TextDecoder()
      let tempNativeMsg = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        tempNativeMsg+=chunk
        analysis.value = marked(tempNativeMsg) as string
      }
    })

    getSpeechByText(text).then(res=>{
      audioSrc.value = res.data?.url||''
    })

    eventSource.addEventListener('begin', e => {
      translateContent.value = ''
    })

    eventSource.addEventListener('message', e => {
      if (e.type === 'message') {
        translateContent.value += JSON.parse(e.data)['transIncre']
        console.log(translateContent.value)

        if (!isOutputing.value) {
          isOutputing.value = true
          document.onselectstart = () => false
        }
      }
    })

    eventSource.addEventListener('end', e => {
      isOutputing.value = false
      document.onselectstart = null
      eventSource.close()
    })
  }
}

const onCollectChangeHandler = async (e: boolean) => {
  if (!articleDetail.value) {
    return
  }
  try {
    if (e) {
      const res = await reqPostCollect({
        itemId: articleDetail.value?.id,
        type: CollectType.ARTICLE
      })
      if (res.code === 200) {
        AntdMessage.success('收藏成功', 2)
      }
    } else {
      const res = await reqDeleteCollect(articleDetail.value?.id)
      if (res.code === 200) {
        AntdMessage.success('取消收藏成功', 2)
      }
    }
  } catch {
    AntdMessage.error('操作失败')
  }
}

// 初始化
onMounted(() => {
  fetchArticleDetail()

  if (isMobileDevice()) {
    document.addEventListener(
      'selectionchange',
      useDebounceFn(onSelectionChangeHandler, 1000)
    )
  } else {
    document.addEventListener(
      'mouseup',
      useDebounceFn(onSelectionChangeHandler, 100)
    )
  }

  window.addEventListener('click', e => {
    if (
      document
        .querySelector('.translate-card-container')
        ?.contains(e.target as HTMLElement)
    ) {
      return
    }
    if (translateContent.value) {
      translateContent.value = ''
      sourceContent.value = ''
    }
  })
})

// onUnmounted(() => {
//   document.removeEventListener('mouseup', onSelectionChangeHandler)
//   document.removeEventListener('touchend', onSelectionChangeHandler)
// })

onActivated(() => {
  fetchArticleDetail()
})
</script>

<style scoped>
.article-detail-container {
  background-color: var(--card-bg);
  color: var(--content);
}

img {
  max-width: 100%;
  display: block;
}

.comments-section {
  background-color: var(--card-bg);
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: var(--shadow);
}

:deep(.ant-comment-content-detail) {
  margin-bottom: 8px;
}

:deep(.ant-comment-nested) {
  margin-top: 0;
}

:deep(.ant-comment) {
  background-color: transparent;
}

:deep(.ant-textarea) {
  background-color: var(--card-bg);
  color: var(--content);
  border-color: var(--border-primary-1);
}

:deep(.ant-textarea:focus) {
  border-color: var(--accent-text);
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2);
}

:deep(.ant-btn-primary) {
  background-color: var(--accent-bg);
  border-color: var(--accent-bg);
}

:deep(.ant-btn-primary:hover) {
  background-color: var(--accent-active-bg);
  border-color: var(--accent-active-bg);
}

:deep(.ant-empty-description) {
  color: var(--content);
}

/* 减少评论组件的内边距和外边距 */
:deep(.comment-item .ant-comment-inner) {
  padding: 8px 0;
}

:deep(.reply-item .ant-comment-inner) {
  padding: 4px 0;
}

:deep(.reply-item) {
  margin-bottom: 8px;
}

:deep(.nested-comments .ant-comment-content) {
  padding-left: 8px;
}

:deep(.ant-comment-actions) {
  margin-top: 4px;
}

:deep(.ant-comment-content-author) {
  margin-bottom: 2px;
}
</style>
