<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePaintStore } from '@/stores/paint'

const router = useRouter()
const store = usePaintStore()

onMounted(() => {
  store.loadConfig()
  // 添加首页模式标识，用于移动端样式切换
  document.documentElement.classList.add('home-mode')
})

onUnmounted(() => {
  // 离开首页时移除标识
  document.documentElement.classList.remove('home-mode')
})

function openAnimal(id: string) {
  router.push({ name: 'studio', params: { id } })
}
</script>

<template>
  <main class="app-shell app-shell-home">
    <div class="page">
      <div class="gallery home-gallery">
        <div v-if="store.loading" class="loading">正在整理蜡笔和画纸...</div>

        <div v-else-if="store.error" class="empty-state">
          <p>页面没能读取到 <code>/config.json</code>。</p>
          <p>{{ store.error }}</p>
        </div>

        <div v-else-if="store.animals.length === 0" class="empty-state">
          当前还没有动物线稿，先去 <code>/config.json</code> 加几张吧。
        </div>

        <div v-else class="gallery-grid home-grid">
          <button
            v-for="item in store.animals"
            :key="item.id"
            class="animal-card animal-card-home"
            :aria-label="`打开${item.name}`"
            @click="openAnimal(item.id)"
          >
            <div class="animal-thumb">
              <img :src="item.path" :alt="item.name" />
            </div>
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
