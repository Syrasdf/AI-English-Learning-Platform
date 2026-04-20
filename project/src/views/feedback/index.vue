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
            <el-button @click="refresh" type="primary">
              刷新
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
    <el-card style="margin: 10px 0px">
      <el-table :data="feedbackList" width="100%" border>
        <el-table-column label="评论id" width="250" prop="id"></el-table-column>
        <el-table-column
          label="评论者"
          width="200"
          align="center"
        >
          <template #default="{ row }">
            <div>{{ row.user.username }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="文章标题"
          width="250"
          align="center"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <div>{{ row.article.title }}</div>
          </template>
        </el-table-column>
        <el-table-column label="评论内容" align="center" width="300">
          <template #default="{ row }">
            <div>{{ row.content || '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="200"
          align="center"
        >
          <template #default="{ row }">
            {{ row.createTime ? dayjs(row.createTime).format('YYYY-MM-DD HH:mm') : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150" align="center">
          <template #default="{ row }">
            <div class="operation">
              <el-button
                @click="onSuspenseClickHandler(row)"
                type="primary"
                plain
              >
                {{ row.deleteFlag === 0 ? '下架' : '上架' }}
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch,nextTick } from 'vue'
import useLayOutSettingStore from '@/store/modules/setting'
import { ElNotification } from 'element-plus'
import { reqGetFeedback, reqPutFeedback } from '@/api/feedback'
import dayjs from 'dayjs'
import type { TabsPaneContext } from 'element-plus'
import { FeedbackReponseType } from '@/api/feedback/type'

const layOutStore = useLayOutSettingStore()

const feedbackData = ref({
  pageNum: 1,
  pageSize: 10,
  deleteFlag: null as any
})
const feedbackList = ref<FeedbackReponseType[]>([])
const total = ref(0)
const currentPage = ref(1)
const activeName = ref('-1')

const refresh = () => {
  getFeedbackList()
}

const onTabClickHandler = async (tab: TabsPaneContext, event: Event) => {
  await nextTick()
  feedbackData.value.pageNum = 1
  if(activeName.value !== '-1'){
    feedbackData.value.deleteFlag = activeName.value
  } else {
    feedbackData.value.deleteFlag = null
  }
  getFeedbackList()
}

const onSuspenseClickHandler = async (item: FeedbackReponseType) => {
  try {
    const res = await reqPutFeedback({
      id: item.id,
      deleteFlag: item.deleteFlag === 0 ? 1 : 0
    })
    if (res.code === 200) {
      ElNotification({
        type: 'success',
        title: item.deleteFlag === 0 ? '下架成功' : '上架成功',
      })
      getFeedbackList()
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

const getFeedbackList = () => {
  reqGetFeedback({
    pageNum: feedbackData.value.pageNum,
    pageSize: feedbackData.value.pageSize,
    deleteFlag:feedbackData.value.deleteFlag
  }).then((res) => {
    feedbackList.value = res.data.records
    total.value = res.data.total || 0
  })
}

watch(currentPage, () => {
  feedbackData.value.pageNum = currentPage.value
  getFeedbackList()
  ;(layOutStore.layOutMainRef as any).scrollTo({
    top: 0,
  })
})

// 初始化加载
getFeedbackList()
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