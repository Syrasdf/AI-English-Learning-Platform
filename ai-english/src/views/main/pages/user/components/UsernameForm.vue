<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="username" class="block text-sm font-medium text-content mb-1">用户名</label>
      <input
        type="text"
        id="username"
        v-model="username"
        class="w-full px-4 py-2 rounded-lg border border-border-primary-1 focus:ring-2 focus:ring-accent-text focus:border-transparent bg-transparent text-title"
        required
      >
    </div>
    <button
      type="submit"
      class="w-full bg-button-primary-bg text-button-primary-text py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
    >
      更新用户名
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  username: string;
}>();

const emit = defineEmits<{
  (e: 'update-username', username: string): void;
}>();

const username = ref(props.username);

watch(() => props.username, (newVal) => {
  username.value = newVal;
});

const handleSubmit = () => {
  if (username.value.trim() && username.value !== props.username) {
    emit('update-username', username.value.trim());
  }
};
</script>