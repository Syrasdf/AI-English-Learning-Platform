<template>
  <div>
    <el-card style="margin: 10px 0" class="card">
      <div class="flex items-center w-full">
        <div>
          <el-tabs
            v-model="activeName"
            class="demo-tabs"
            @tab-click="onTabClickHandler"
          >
            <el-tab-pane label="全部" name="-1"></el-tab-pane>
            <el-tab-pane label="已上架" name="0"></el-tab-pane>
            <el-tab-pane label="已下架" name="1"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="flex w-full justify-end">
          <div>
            <el-button @click="onNewArticleClickHandler" type="primary">
              新建文章
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
    <el-card style="margin: 10px 0px">
      <el-table :data="articleList" width="100%" border>
        <el-table-column label="文章id" width="250" prop="id"></el-table-column>
        <el-table-column label="文章封面" width="200" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.coverImage"
              :src="row.coverImage"
              :preview-src-list="[row.coverImage]"
              :z-index="10"
              preview-teleported
              style="width: 100%; aspect-ratio: 1"
            ></el-image>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column
          label="文章标题"
          prop="title"
          width="150"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="文章内容" align="center" width="300">
          <template #default="{ row }">
            <div>{{ row.content.slice(0, 10) }}...</div>
          </template>
        </el-table-column>
        <el-table-column label="作者" align="center" width="120">
          <template #default="{ row }">
            {{ row.user.username }}
          </template>
        </el-table-column>
        <el-table-column
          label="浏览量"
          prop="views"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          label="评论量"
          prop="feedbackCount"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="150"
          align="center"
        >
          <template #default="{ row }">
            {{ dayjs(row.createTime).format('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="150"
          align="center"
        >
          <template #default="{ row }">
            {{ dayjs(row.updateTime).format('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200" align="center">
          <template #default="{ row, $index }">
            <div class="operation">
              <el-button
                @click="onSuspenseClickHandler(row)"
                type="primary"
                plain
              >
                {{ row.deleteFlag === 0 ? '下架' : '上架' }}
              </el-button>
              <el-button
                @click="onUpdateClickHandler(row)"
                type="primary"
                plain
              >
                修改
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px"
        :page-size="10"
        hide-on-single-page
        :total="total"
        v-model:current-page="currentPage"
      ></el-pagination>
    </el-card>

    <Transition
      enter-active-class="animate__animated animate__zoomIn"
      leave-active-class="animate__animated animate__zoomOut"
    >
      <div v-if="isShowRichEditor" class="fixed inset-[0] bg-[#fff] z-[1000]">
        <div
          @click="onEditorBackClickHandler"
          class="absolute top-[16px] left-[16px]"
        >
          <el-icon size="32"><Back /></el-icon>
        </div>
        <div
          @click="onArticleSaveClickHandler"
          class="absolute bottom-[32px] right-[32px]"
        >
          <el-button type="primary" size="large">保存</el-button>
        </div>
        <div
          class="absolute top-[96px] w-1/5 flex flex-col items-center justify-center"
        >
          <div class="py-[12px]">上传封面</div>
          <el-upload
            class="avatar-uploader"
            action="/api/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            accept="image/*"
            :headers="{
              Authorization: 'Bearer ' + userStore?.token,
            }"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </div>
        <ArticleEditor ref="articleRef"></ArticleEditor>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import {
  nextTick,
  onBeforeUnmount,
  reactive,
  ref,
  shallowRef,
  watch,
} from 'vue'
import useLayOutSettingStore from '@/store/modules/setting'
// @ts-ignore
import { ElNotification } from 'element-plus'
import { reqGetArticle, reqPostArticle, reqPutArticle } from '@/api/article'
import { ArticleData } from '@/api/article/type'
import dayjs from 'dayjs'
import ArticleEditor from './components/ArticleEditor.vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { TabsPaneContext, UploadProps } from 'element-plus'
import { isImageMimeType } from '@/utils'
import useUserStore from '@/store/modules/user'
import { useRoute, useRouter } from 'vue-router'

const layOutStore = useLayOutSettingStore()
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()

const articleData = ref({
  keyWord: null,
  pageNum: 1,
  pageSize: 10,
  state: null,
  deleteFlag:null as any
})
const articleList = ref<ArticleData[]>([])
const total = ref(0)
const imageUrl = ref('')
const currentPage = ref(1)
const isShowRichEditor = ref(false)
const activeName = ref('-1')
let activeArticle: ArticleData | null = null
let coverImage: string

const articleRef = ref()

const search = () => {
  reqGetArticle()
}

const onTabClickHandler = async (tab: TabsPaneContext, event: Event) => {
  await nextTick()
  articleData.value.pageNum = 1
  if(activeName.value!=='-1'){
    articleData.value.deleteFlag = activeName.value
  }else{
    articleData.value.deleteFlag = null
  }
  reqGetArticle(articleData.value).then((res) => {
    articleList.value = res.data.records
    total.value = res.data.total
  })
}

const onNewArticleClickHandler = () => {
  imageUrl.value = ''
  isShowRichEditor.value = true
  activeArticle = null
}

const onEditorBackClickHandler = () => {
  isShowRichEditor.value = false
}

const onArticleSaveClickHandler = async () => {
  if (
    !articleRef.value.editorRef.getText().trim() ||
    !articleRef.value.title.trim()
  ) {
    ElNotification({
      type: 'error',
      title: '保存失败',
      message: '标题或内容不能为空',
    })
    return
  }

  const data = {
    title: articleRef.value.title,
    content: articleRef.value.editorRef.getHtml(),
    coverImage,
    id: activeArticle?.id,
  }

  try {
    const res = await reqPostArticle(data)
    if (res.code === 200) {
      ElNotification({
        type: 'success',
        title: '保存成功',
      })
      isShowRichEditor.value = false
      imageUrl.value = ''
      reqGetArticle(articleData.value).then((res) => {
        articleList.value = res.data.records
        total.value = res.data.total
      })
    } else {
      throw new Error()
    }
  } catch (e) {
    console.log(e)

    ElNotification({
      type: 'error',
      title: '保存失败',
    })
  }
}

const onSuspenseClickHandler = async (item: ArticleData) => {
  try {
    const res = await reqPutArticle(item.id, item.deleteFlag === 0 ? 1 : 0)
    if (res.code === 200) {
      ElNotification({
        type: 'success',
        title: item.deleteFlag === 0 ? '下架成功' : '上架成功',
      })
      reqGetArticle(articleData.value).then((res) => {
        articleList.value = res.data.records
        total.value = res.data.total
      })
    } else {
      throw new Error()
    }
  } catch {
    ElNotification({
      type: 'error',
      title: item.deleteFlag === 0 ? '下架失败' : '上架失败',
    })
  }
}

const onUpdateClickHandler = (item: ArticleData) => {
  isShowRichEditor.value = true
  activeArticle = item
  nextTick(() => {
    coverImage = item.coverImage
    imageUrl.value = item.coverImage
    articleRef.value.title = item.title
    articleRef.value.editorRef.setHtml(item.content)
  })
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  if (response.code === 401) {
    localStorage.removeItem('token') // 测试用
    userStore.token = null // 测试用
    router.push({ path: '/login', query: { redirect: route.path } })
  }
  coverImage = response.data.url
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (!isImageMimeType(rawFile.type)) {
    ElMessage.error('只能上传图片')
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('图片不能超过5MB')
    return false
  }
  return true
}

watch(currentPage, () => {
  articleData.value.pageNum = currentPage.value
  reqGetArticle(articleData.value).then((res) => {
    articleList.value = res.data.records
    total.value = res.data.total
    ;(layOutStore.layOutMainRef as any).scrollTo({
      top: 0,
    })
  })
})

reqGetArticle(articleData.value).then((res) => {
  articleList.value = res.data.records
  total.value = res.data.total
})
</script>

<style scoped>
:deep(.el-collapse-item__header) {
  padding-left: 10px;
  cursor: pointer !important;
}

.operation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.card :deep(.el-card__body) {
  display: flex;
  justify-content: space-between;
}

:deep(.el-button) {
  display: block;
  width: 100%;
  margin: 0;
}

.dialog-footer {
  display: flex;
  justify-content: right;
}

.state {
  display: flex;
  width: 100%;
  justify-content: space-between;
  & > div {
    cursor: pointer;
    text-align: center;
    width: 25%;
    height: 100%;

    &.state-active {
      position: relative;
      &::after {
        display: block;
        content: '';
        width: 30%;
        height: 3px;
        background-color: #000;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 24px;
      }
    }
  }
}

.upload-active :deep(.el-upload--picture-card) {
  display: none;
}

.drawer-footer {
  display: flex;
  justify-content: right;
  gap: 10px;
}

.drawer-footer :deep(.el-button) {
  width: auto;
}

.animate__animated.animate__zoomIn {
  --animate-duration: 0.5s;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
}
</style>
