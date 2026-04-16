import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

import configData from '@/static/config.json'

// 使用 Vite glob 导入所有图片
const imageModules = import.meta.glob('@/static/images/*.png', { eager: true, import: 'default' }) as Record<string, string>

export interface AnimalItem {
  id: string
  name: string
  path: string
}

export interface ConfigPayload {
  list?: AnimalItem[]
}

export const usePaintStore = defineStore('paint', () => {
  const animals = ref<AnimalItem[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  // 绘画状态
  const tool = ref<'brush' | 'eraser'>('brush')
  const color = ref('#ff5d73')
  const brushSize = ref(16)
  const canvasDataUrl = ref<string | null>(null)

  const COLORS = [
    '#ff5d73',
    '#ff9a3d',
    '#ffd84d',
    '#96d95c',
    '#4ecdc4',
    '#56a4ff',
    '#7c6cff',
    '#ff78bc',
    '#8a5b34',
    '#111111',
    '#ffffff',
    '#cbd5e1',
  ]

  const SIZES = [8, 16, 26]

  function getImagePath(imageName: string): string {
    const key = `/src/static/images/${imageName}`
    return imageModules[key] ?? ''
  }

  function loadConfig() {
    loading.value = true
    error.value = null
    try {
      const payload = configData as ConfigPayload
      animals.value = (payload.list ?? []).map((item) => {
        const imageName = item.path.replace(/^\.\//, '').replace(/^images\//, '')
        return {
          ...item,
          id: item.id ?? encodeURIComponent(item.name.trim().toLowerCase()),
          path: getImagePath(imageName),
        }
      })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  function selectTool(nextTool: 'brush' | 'eraser') {
    tool.value = nextTool
  }

  function selectColor(nextColor: string) {
    color.value = nextColor
    if (tool.value !== 'brush') {
      tool.value = 'brush'
    }
  }

  function selectSize(nextSize: number) {
    brushSize.value = nextSize
  }

  function saveCanvasData(dataUrl: string) {
    canvasDataUrl.value = dataUrl
  }

  function getAnimalById(id: string): AnimalItem | undefined {
    return animals.value.find((a) => a.id === id)
  }

  return {
    animals,
    loading,
    error,
    tool,
    color,
    brushSize,
    COLORS,
    SIZES,
    loadConfig,
    selectTool,
    selectColor,
    selectSize,
    saveCanvasData,
    getAnimalById,
  }
})