<template>
  <div class="bg-card-bg rounded-xl shadow-lg overflow-hidden">
    <div class="border-b border-border-primary-1 px-6 py-4">
      <h3 class="text-lg font-semibold text-title">{{ title }}</h3>
    </div>
    <div class="p-6">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title:string
}>()
</script>