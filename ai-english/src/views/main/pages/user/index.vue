<template>
  <div ref="container" class="min-h-screen bg-gradient-to-br from-accent-bg to-translate-card-bg p-4 md:p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-title font-shuhei mb-8">个人中心</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1">
          <UserProfileCard 
            :user="userStore.userInfo!" 
            @update-avatar="handleUpdateAvatar"
          />
        </div>
        
        <div class="lg:col-span-2 space-y-6">
          <ProfileSection title="个人信息">
            <UsernameForm 
              :username="userStore.userInfo!.username" 
              @update-username="handleUpdateUsername"
            />
          </ProfileSection>
          
          <ProfileSection title="账户安全">
            <PasswordForm @update-password="handleUpdatePassword" />
          </ProfileSection>
          
          <ProfileSection title="我的收藏">
            <FavoritesList 
              :articles="favorites" 
              @remove-favorite="handleRemoveFavorite"
            />
          </ProfileSection>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import UserProfileCard from './components/UserProfileCard.vue';
import ProfileSection from './components/ProfileSection.vue';
import UsernameForm from './components/UsernameForm.vue';
import PasswordForm from './components/PasswordForm.vue';
import FavoritesList from './components/FavoritesList.vue';
import { userStore } from '@/store';
import { reqGetCollectArticle } from '@/api';
import { hasUsername, updateUserData, uploadFile } from '@/api/user';
import { message as AntdMessage } from 'ant-design-vue';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image?: string;
}

const favorites = ref<Article[]>([
  {
    id: 'art-1',
    title: 'TailwindCSS 最佳实践',
    excerpt: '探索如何使用TailwindCSS构建现代化的用户界面...',
    date: '2023-05-10',
    image: 'https://source.unsplash.com/random/300x200?tech'
  },
  {
    id: 'art-2',
    title: 'Vue 3 组合式API深入',
    excerpt: '了解Vue 3的组合式API如何提升你的开发体验...',
    date: '2023-04-22'
  },
  {
    id: 'art-3',
    title: 'TypeScript类型体操',
    excerpt: '掌握TypeScript高级类型技巧，提升代码质量...',
    date: '2023-03-18',
    image: 'https://source.unsplash.com/random/300x200?code'
  }
]);

const handleUpdateUsername = async (newUsername: string) => {
  try {
    const res = await hasUsername(newUsername);
    if(!res.data){
      AntdMessage.error('用户名已存在');
      return;
    }
    await updateUserData({ username: newUsername });
    AntdMessage.success('用户名更新成功');
  } catch (error) {
    AntdMessage.error('用户名更新失败');
  }
};

const handleUpdatePassword = async (passwordData: { currentPassword: string; newPassword: string }) => {
  // if(passwordData.newPassword !== passwordData.currentPassword) {
  //   AntdMessage.error('新密码和旧密码不匹配');
  //   return;
  // }

  try {
    await updateUserData({ password: passwordData.newPassword });
    AntdMessage.success('密码更新成功');
  } catch (error) {
    AntdMessage.error('密码更新失败');
  }
};

const handleUpdateAvatar =async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  try{
    const res = await uploadFile(formData)
    userStore.userInfo!.avatar = res.data?.url || ''
    await updateUserData({
      avatar:res.data?.url || ''
    })
    AntdMessage.success('头像更新成功')
  }catch{
    AntdMessage.error('头像更新失败')
  }
};

const handleRemoveFavorite = (articleId: string) => {
  console.log('移除收藏:', articleId);
  favorites.value = favorites.value.filter(art => art.id !== articleId);
};

reqGetCollectArticle().then(res=>{
  if(res.code===200&&res.data){
    favorites.value = res.data.map(item=>{
      const div = document.createElement('div')
      div.innerHTML = item.content
      const rawContent = div.textContent
      return {
        id: item.id,
        title: item.title,
        excerpt: rawContent||'',
        date: item.createTime,
        image: item.coverImage
      }
    })
  }
})
</script>