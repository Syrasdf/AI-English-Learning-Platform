<template>
  <img class="w-5 h-5 rounded-full object-cover" :style="{
      fontSize:size||'16px'
    }" v-if="!isError&&url" :src="url" @error="isError = true">
  <div v-else class="p-1 flex items-center justify-center rounded-full">
    <UserOutlined class="text-title" :style="{
      fontSize:size||'16px'
    }"/>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UserOutlined } from '@ant-design/icons-vue';

const isError = ref(false)

 defineProps<{
  url:string,
  size?:string
}>()
</script>

<style scoped>

</style>