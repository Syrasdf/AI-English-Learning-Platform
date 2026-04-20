<template>
  <Header1></Header1>
  <router-view #default="{ Component }">
    <KeepAlive :max="2" :exclude="['ArticleDetail']">
      <component :is="Component"></component>
    </KeepAlive>
  </router-view>
</template>

<script setup lang="ts">
import Header1 from '@/components/Header1.vue'
</script>

<style scoped></style>
