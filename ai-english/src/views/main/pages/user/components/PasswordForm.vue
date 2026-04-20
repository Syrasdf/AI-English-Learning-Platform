<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="newPassword" class="block text-sm font-medium text-content mb-1">新密码</label>
      <input
        type="password"
        id="newPassword"
        v-model="newPassword"
        class="w-full px-4 py-2 rounded-lg border border-border-primary-1 focus:ring-2 focus:ring-accent-text focus:border-transparent bg-transparent text-title"
        required
        minlength="6"
      >
      <p class="text-xs text-content mt-1">密码至少6位字符</p>
    </div>
    
    <div>
      <label for="confirmPassword" class="block text-sm font-medium text-content mb-1">确认新密码</label>
      <input
        type="password"
        id="confirmPassword"
        v-model="confirmPassword"
        class="w-full px-4 py-2 rounded-lg border border-border-primary-1 focus:ring-2 focus:ring-accent-text focus:border-transparent bg-transparent text-title"
        required
      >
      <p v-if="passwordMismatch" class="text-xs text-red-500 mt-1">两次输入的密码不一致</p>
    </div>
    
    <button
      type="submit"
      :disabled="passwordMismatch || !formValid"
      class="w-full bg-button-primary-bg text-button-primary-text py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      更新密码
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const emit = defineEmits<{
  (e: 'update-password', data: { currentPassword: string; newPassword: string }): void;
}>();

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const passwordMismatch = computed(() => {
  return newPassword.value && confirmPassword.value && newPassword.value !== confirmPassword.value;
});

const formValid = computed(() => {
  return newPassword.value && confirmPassword.value && !passwordMismatch.value;
});

const handleSubmit = () => {
  if (formValid.value) {
    emit('update-password', {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    });
    currentPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  }
};
</script>