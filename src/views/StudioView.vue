<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePaintStore } from '@/stores/paint'
import DrawingCanvas from '@/components/DrawingCanvas.vue'

const route = useRoute()
const router = useRouter()
const store = usePaintStore()

const animalId = route.params.id as string
const animal = ref(store.getAnimalById(animalId))

onMounted(async () => {
  if (!animal.value) {
    router.push('/')
  }
})

function goBack() {
  router.push('/')
}

async function downloadArtwork() {
  const canvasEl = document.getElementById('paint-canvas') as HTMLCanvasElement | null
  const imageEl = document.getElementById('line-art') as HTMLImageElement | null

  if (!canvasEl || !imageEl) return

  const exportCanvas = document.createElement('canvas')
  exportCanvas.width = canvasEl.width
  exportCanvas.height = canvasEl.height
  const exportCtx = exportCanvas.getContext('2d')
  if (!exportCtx) return

  exportCtx.drawImage(canvasEl, 0, 0)

  const finishDownload = () => {
    exportCtx.drawImage(imageEl, 0, 0, exportCanvas.width, exportCanvas.height)
    const link = document.createElement('a')
    link.href = exportCanvas.toDataURL('image/png')
    link.download = `${animal.value?.name || '涂色'}-涂色.png`
    link.click()
  }

  if (!imageEl.complete) {
    await imageEl.decode().catch(() => undefined)
  }
  finishDownload()
}
</script>

<template>
  <main class="app-shell app-shell-studio" v-if="animal">
    <div class="page studio-page">
      <section class="studio-layout">
        <div class="studio-main">
          <!-- Mobile Palette -->
          <div class="mobile-palette tool-tray">
            <div class="pencil-row palette-grid-mobile">
              <button
                v-for="c in store.COLORS"
                :key="c"
                class="swatch color-swatch"
                :class="{ active: store.color === c }"
                type="button"
                :style="{ background: c }"
                :aria-label="`选择颜色 ${c}`"
                @click="store.selectColor(c)"
              ></button>
            </div>
          </div>

          <div class="canvas-panel">
            <div class="drawing-stage" :aria-label="`${animal.name}涂色纸`">
              <div class="paper-tape paper-tape-left"></div>
              <div class="paper-tape paper-tape-right"></div>
              <DrawingCanvas :image-path="animal.path" :animal-name="animal.name" />
            </div>
          </div>
        </div>

        <aside class="sidebar tool-rack" aria-label="绘画工具">
          <section class="tool-tray side-tools tool-stack">
            <!-- Desktop Palette -->
            <div class="tool-row tool-row-colors desktop-palette">
              <div class="pencil-column">
                <button
                  v-for="c in store.COLORS"
                  :key="c"
                  class="swatch color-swatch"
                  :class="{ active: store.color === c }"
                  type="button"
                  :style="{ background: c }"
                  :aria-label="`选择颜色 ${c}`"
                  @click="store.selectColor(c)"
                ></button>
              </div>
            </div>

            <!-- Tool Buttons -->
            <div class="tool-row">
              <button
                class="tool-button icon-tool"
                :class="{ active: store.tool === 'brush' }"
                type="button"
                aria-label="画笔"
                @click="store.selectTool('brush')"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14 5 19 10" />
                  <path d="M6 18c1.5 2 4.5 2 6 0l7-7-5-5-7 7c-2 1.5-2.3 3.8-1 5z" />
                </svg>
              </button>
            </div>

            <div class="tool-row">
              <button
                class="tool-button icon-tool"
                :class="{ active: store.tool === 'eraser' }"
                type="button"
                aria-label="橡皮"
                @click="store.selectTool('eraser')"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m8 6 10 10" />
                  <path
                    d="m6 14 6-6c1-1 2.5-1 3.5 0l2.5 2.5c1 1 1 2.5 0 3.5l-3 3H9c-1 0-2-.4-3-.9z"
                  />
                  <path d="M4 18h14" />
                </svg>
              </button>
            </div>

            <!-- Size Presets -->
            <div class="tool-row tool-row-size">
              <div class="size-slider" aria-label="粗细">
                <span class="size-slider-label">细</span>
                <input
                  class="size-range"
                  type="range"
                  :min="store.MIN_BRUSH_SIZE"
                  :max="store.MAX_BRUSH_SIZE"
                  :value="store.brushSize"
                  aria-label="调整画笔粗细"
                  @input="store.selectSize(Number(($event.target as HTMLInputElement).value))"
                />
                <span class="size-slider-label">粗</span>
                <div class="size-preview" aria-hidden="true">
                  <span
                    class="size-preview-dot"
                    :style="{ width: `${store.brushSize}px`, height: `${store.brushSize}px` }"
                  ></span>
                </div>
              </div>
            </div>

            <div class="tool-row tool-row-actions">
              <div class="action-row">
                <button
                  class="icon-button cta-button full-row-button"
                  type="button"
                  aria-label="保存图片"
                  @click="downloadArtwork"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 4h9l3 3v13H6z" />
                    <path d="M9 4v5h6V4" />
                    <path d="M9 17h6" />
                  </svg>
                </button>

                <button
                  class="icon-button back-button full-row-button"
                  type="button"
                  aria-label="返回"
                  @click="goBack"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M14.5 5 7.5 12l7 7" />
                    <path d="M8.5 12h8" />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        </aside>
      </section>
    </div>
  </main>
</template>
