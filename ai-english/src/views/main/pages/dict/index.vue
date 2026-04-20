<template>
  <div class="dict-container p-4 h-full box-border">
    <div class="w-full h-full box-border flex flex-col">
      <div class="w-full flex items-center justify-center gap-4">
        <input
          v-model="word"
          type="text"
          placeholder="请输入要查询的单词"
          class="border border-border-primary-1 rounded px-4 py-2 w-1/2 focus:outline-none focus:border-accent-text"
        />
        <button
          @click="onSearch"
          class="px-4 py-2 bg-button-primary-bg text-button-primary-text rounded transition-all"
        >
          查询
        </button>
      </div>
      <div v-if="loading" class="mt-4 text-center text-content">加载中...</div>
      <div v-else-if="error" class="mt-4 text-center text-red-500">{{ error }}</div>
      <div v-else-if="result" class="mt-4 flex flex-col gap-6 overflow-y-auto">
        <div class="text-title text-xl font-bold">{{ result.word }}</div>
        <div>
          <div class="text-content font-semibold">词性：</div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="pos in result.dict.pos"
              :key="pos"
              class="px-2 py-1 bg-accent-bg text-accent-text rounded"
            >
              {{ pos }}
            </span>
          </div>
        </div>
        <div>
          <div class="text-content font-semibold">释义：</div>
          <div class="flex flex-col gap-4">
            <div
              v-for="definition in result.dict.definition"
              :key="definition.id"
              class="p-4 border border-border-primary-1 rounded"
            >
              <div class="text-title font-semibold">{{ definition.pos }}</div>
              <div class="text-content">{{ definition.text }}</div>
              <div class="text-content text-sm mt-2">
                <span class="font-semibold">翻译：</span>{{ definition.translation }}
              </div>
              <div v-if="definition.example.length" class="mt-2">
                <div class="text-content font-semibold">例句：</div>
                <ul class="list-disc pl-6">
                  <li
                    v-for="example in definition.example"
                    :key="example.id"
                    class="text-content text-sm"
                  >
                    {{ example.text }}
                    <span v-if="example.translation" class="text-accent-text">
                      - {{ example.translation }}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="text-content font-semibold">发音：</div>
          <div class="flex flex-wrap gap-4">
            <div
              v-for="pron in result.dict.pronunciation"
              :key="pron.url"
              class="flex items-center gap-2"
            >
              <span class="text-content">{{ pron.lang }} ({{ pron.pos }})：</span>
              <audio :src="pron.url" controls class="h-8"></audio>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getDictData } from '@/api/dict';
import type { DictResponse } from '@/api/types/dict';

const word = ref('');
const result = ref<DictResponse | null>(null);
const loading = ref(false);
const error = ref('');

const onSearch = async () => {
  if (!word.value.trim()) {
    error.value = '请输入一个单词';
    return;
  }
  loading.value = true;
  error.value = '';
  result.value = null;
  try {
    const res = await getDictData({ word: word.value.trim() });
    result.value = res.data!;
  } catch (err) {
    error.value = '查询失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped></style>