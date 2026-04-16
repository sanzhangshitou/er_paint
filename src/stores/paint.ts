import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

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

  async function loadConfig() {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('/config.json', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('Failed to load /config.json')
      }
      const payload = (await response.json()) as ConfigPayload
      animals.value = (payload.list ?? []).map((item) => ({
        ...item,
        id: item.id ?? encodeURIComponent(item.name.trim().toLowerCase()),
        path: item.path.startsWith('./')
          ? `/${item.path.slice(2)}`
          : item.path.startsWith('/')
            ? item.path
            : `/${item.path}`,
      }))
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
