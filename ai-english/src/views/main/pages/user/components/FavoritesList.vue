<template>
  <div v-if="articles.length > 0" class="space-y-4">
    <div 
      v-for="article in articles" 
      :key="article.id"
      class="group flex items-start p-4 rounded-lg hover:bg-accent-bg transition-colors"
      @click="onArticleCollectClickHandler(article.id)"
    >
      <div v-if="article.image" class="flex-shrink-0 mr-4">
        <img 
          :src="article.image" 
          alt="文章封面" 
          class="w-16 h-16 object-cover rounded"
        >
      </div>
      <div class="flex-grow">
        <h4 class="font-medium text-title">{{ article.title }}</h4>
        <p class="text-sm text-content mt-1 line-clamp-2">{{ article.excerpt }}</p>
        <div class="flex justify-between items-center mt-2">
          <span class="text-xs text-content">{{ formatDate(article.date) }}</span>
          <button 
            @click="handleRemove(article.id)"
            class="text-xs text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            取消收藏
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-8 text-content">
    <p>暂无收藏文章</p>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image?: string;
}

const router = useRouter()

const props = defineProps<{
  articles: Article[];
}>();

const emit = defineEmits<{
  (e: 'remove-favorite', articleId: string): void;
}>();

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString();
};

const handleRemove = (articleId: string) => {
  emit('remove-favorite', articleId);
};

const onArticleCollectClickHandler = (id:string)=>{
  router.push(`/article/${id}`)
}
</script>