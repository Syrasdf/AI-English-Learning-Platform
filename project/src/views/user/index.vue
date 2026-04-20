<template>
  <div>
    <el-card style="height: 80px">
      <el-form inline>
        <el-form-item label="用户名">
          <el-input
            placeholder="请输入用户名"
            v-model="keyword"
            @keydown.enter="search"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin: 10px 0px">
      <el-table
        :data="userInfoList?.slice((currentPage - 1) * 10, currentPage * 10)"
        width="100%"
      >
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center">
          <template #="{row}">
            <div>{{ row.phone || '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间">
          <template #default="{ row }">
            {{dayjs(row.createTime).format('YYYY-MM-DD') }}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间">
          <template #default="{ row }">
            {{dayjs(row.updateTime).format('YYYY-MM-DD') }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 20px"
        :page-size="10"
        hide-on-single-page
        :total="userInfoList.length"
        v-model:current-page="currentPage"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reqUserInfo } from '@/api/user'
import { userInfoData } from '@/api/user/type'
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'

const userInfoList = ref<userInfoData[]>([])
const userInfoList2 = ref<userInfoData[]>([])
const currentPage = ref(1)
const keyword = ref('')

const search = () => {
  if (keyword.value) {
    userInfoList.value = userInfoList.value.filter((item) =>
      item.username.includes(keyword.value),
    )
  } else {
    userInfoList.value = userInfoList2.value
  }
}

reqUserInfo().then((res) => {
  userInfoList.value = res.data
  userInfoList2.value = res.data
})
</script>

<style scoped></style>
