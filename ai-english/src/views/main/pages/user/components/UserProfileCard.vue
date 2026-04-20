<template>
  <div class="bg-card-bg rounded-xl shadow-lg p-6 sticky top-20">
    <div class="flex flex-col items-center">
      <div class="relative group mb-4">
        <Avatar 
          :url="user?.avatar" 
          alt="用户头像" 
          class="!w-32 !h-32 rounded-full object-cover border-4 border-accent-text"
          size="32px"
        />
        <label 
          class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <span class="text-white text-sm font-medium">更换头像</span>
          <input 
            type="file" 
            accept="image/*" 
            class="hidden" 
            @change="handleFileChange"
          >
        </label>
      </div>
      
      <h2 class="text-xl font-bold text-title mb-1">{{ user?.username }}</h2>
      <p class="text-content text-sm mb-4">{{ user?.email }}</p>
      
      <div class="w-full border-t border-border-primary-1 pt-4">
        <div class="flex justify-between text-sm text-content">
          <span>加入日期</span>
          <span class="text-title">{{ formatDate(user?.createTime) }}</span>
        </div>
      </div>
    </div>

    <a-button @click="onLogoutLClickHandler" class="bg-button-primary-bg !text-button-primary-text w-full mt-3">退出登录</a-button>
  </div>
</template>

<script setup lang="ts">
import Avatar from '@/components/Avatar.vue';
import { logout } from '@/store/modules/userStore';
import { useRouter } from 'vue-router';

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  createTime: string;
}

const props = defineProps<{
  user: User;
}>();

const emit = defineEmits<{
  (e: 'update-avatar', file: File): void;
}>();

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString();
};

const handleFileChange = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    emit('update-avatar', input.files[0]);
  }
};

const router = useRouter()

const onLogoutLClickHandler = () => {
  logout()
  router.push('/home')
};
</script>