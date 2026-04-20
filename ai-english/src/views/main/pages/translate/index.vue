<template>
  <div class="translate-container p-4 h-full box-border">
    <div class="w-full h-full box-border flex flex-col">
      <div class="w-full flex items-center justify-center gap-10">
        <div @click="onModeClickHandler(0)"
          class="hover:text-accent-text hover:border-accent-text transition-all min-w-32 justify-center cursor-pointer flex items-center gap-3 px-4 py-2 font-shuhei border rounded"
          :class="{
            'text-accent-text': mode === 0,
            'border-accent-text': mode === 0,
            'text-title':mode!==0,
            'border-border-primary-1':mode!==0
          }">
          <UserOutlined />
          <div>普通翻译</div>
        </div>
        <div @click="onModeClickHandler(1)"
          class="hover:text-accent-text hover:border-accent-text transition-all min-w-32 justify-center cursor-pointer flex items-center gap-3 px-4 py-2 font-shuhei border rounded"
          :class="{
            'text-accent-text': mode === 1,
            'border-accent-text': mode === 1,
            'text-title':mode!==1,
            'border-border-primary-1':mode!==1
          }">
          <RobotOutlined />
          <div>AI翻译</div>
        </div>
      </div>
      <div class="px-16 max-sm:px-4 py-6 max-sm:py-4 w-full box-border flex-1 overflow-hidden">
        <NormalTranslate v-if="mode === 0"/>
        <LLMTranslate v-else-if="mode === 1"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserOutlined, RobotOutlined } from '@ant-design/icons-vue'
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NormalTranslate from './components/NormalTranslate.vue';
import LLMTranslate from './components/LLMTranslate.vue';

const route = useRoute()
const router = useRouter()

const mode = ref<0 | 1>(0) // 0普通，1 AI

const onModeClickHandler = (value: 0 | 1) => {
  mode.value = value
  router.replace(`/content/translate?mode=${value}`)
}

onMounted(() => {
  (route.query.mode as any) === '0' && (mode.value = 0);
  (route.query.mode as any) === '1' && (mode.value = 1);
  router.replace(`/content/translate?mode=${mode.value}`)
})
</script>

<style scoped></style>
