<template>
  <div>
    <el-card style="margin: 10px 0" class="card">
      <div class="flex items-center w-full">
        <div></div>
        <div class="flex w-full justify-end">
          <div>
            <el-button @click="onNewDictClickHandler" type="primary">
              新增单词
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
    <el-card style="margin: 10px 0px">
      <el-table :data="dictList" width="100%" border>
        <el-table-column label="单词id" width="250" prop="id"></el-table-column>
        <el-table-column
          label="单词"
          prop="word"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column label="词性" align="center" width="300">
          <template #default="{ row }">
            <div>{{ row.dict.pos }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="定义"
          align="center"
          width="500"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            {{ row.dict.definition }}
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

    <el-drawer v-model="isShowAddDictDrawer" title="新增单词" direction="rtl">
      <div class="flex items-center gap-[4px]">
        <div style="flex: 4 1 auto;">
          <el-input v-model="word"></el-input>
        </div>
        <div style="flex: 1 1 auto;">
          <el-button @click="onAutoAddClickHandler" type="primary">
            自动新增
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue'
import useLayOutSettingStore from '@/store/modules/setting'
// @ts-ignore
import { ElNotification } from 'element-plus'
import { reqAddDict, reqDictList, reqPutDict } from '@/api/dict'
import { ArticleData } from '@/api/article/type'
import dayjs from 'dayjs'
import { WordDictType } from '@/api/dict/type'

const layOutStore = useLayOutSettingStore()

const dictData = ref({
  keyWord: null,
  pageNum: 1,
  pageSize: 10,
  state: null,
  deleteFlag: null as any,
})
const dictList = ref<WordDictType[]>([])
const total = ref(0)
const currentPage = ref(1)
const isShowAddDictDrawer = ref(false)
const word = ref('')

const search = () => {
  // reqDictList()
}

const onNewDictClickHandler = () => {
  isShowAddDictDrawer.value = true
}

const onUpdateClickHandler = (item: WordDictType) => {}

const onAutoAddClickHandler = async () => {
  try {
    const res = await reqAddDict(word.value)
    if (res.code === 201) {
      ElNotification({
        type: 'info',
        title: '单词已经存在',
      })
    } else if (res.code === 200) {
      ElNotification({
        type: 'success',
        title: '单词添加成功',
      })
    }
  } catch {}
}

const onSuspenseClickHandler = async (item: ArticleData) => {
  try {
    const res = await reqPutDict(item.id, item.deleteFlag === 0 ? 1 : 0)
    if (res.code === 200) {
      ElNotification({
        type: 'success',
        title: item.deleteFlag === 0 ? '下架成功' : '上架成功',
      })
      reqDictList(dictData.value).then((res) => {
        dictList.value = res.data.records
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

watch(currentPage, () => {
  dictData.value.pageNum = currentPage.value
  reqDictList(dictData.value).then((res) => {
    dictList.value = res.data.records
    total.value = res.data.total
    ;(layOutStore.layOutMainRef as any).scrollTo({
      top: 0,
    })
  })
})

reqDictList(dictData.value).then((res) => {
  dictList.value = res.data.records
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
