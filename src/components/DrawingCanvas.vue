<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { usePaintStore } from '@/stores/paint'

const props = defineProps<{
  imagePath: string
  animalName: string
}>()

const store = usePaintStore()

const stageRef = ref<HTMLDivElement | null>(null)
const artboardRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)
const artboardStyle = ref({
  width: '100%',
  height: '100%',
})

const artworkSize = {
  width: ref(1),
  height: ref(1),
}

let drawing = false
let lastX = 0
let lastY = 0
let resizeObserver: ResizeObserver | null = null

function getContext() {
  return canvasRef.value?.getContext('2d') ?? null
}

function resizeCanvas(width: number, height: number) {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = getContext()
  if (!ctx) return

  const ratio = Math.max(window.devicePixelRatio || 1, 1)

  const snapshot = document.createElement('canvas')
  snapshot.width = canvas.width
  snapshot.height = canvas.height
  snapshot.getContext('2d')?.drawImage(canvas, 0, 0)

  canvas.width = Math.max(1, Math.floor(width * ratio))
  canvas.height = Math.max(1, Math.floor(height * ratio))
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.scale(ratio, ratio)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  if (snapshot.width > 0 && snapshot.height > 0) {
    ctx.drawImage(snapshot, 0, 0, width, height)
  }
}

function updateArtboardLayout() {
  const stage = stageRef.value
  if (!stage) return

  const stageRect = stage.getBoundingClientRect()
  const maxWidth = Math.max(stageRect.width, 1)
  const maxHeight = Math.max(stageRect.height, 1)
  const aspectRatio = artworkSize.width.value / artworkSize.height.value || 1

  let width = maxWidth
  let height = width / aspectRatio

  if (height > maxHeight) {
    height = maxHeight
    width = height * aspectRatio
  }

  artboardStyle.value = {
    width: `${width}px`,
    height: `${height}px`,
  }

  resizeCanvas(width, height)
}

function getPoint(event: PointerEvent): { x: number; y: number } {
  const canvas = canvasRef.value
  if (!canvas) return { x: 0, y: 0 }
  const rect = canvas.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}

function applyStrokeStyle() {
  const ctx = getContext()
  if (!ctx) return

  ctx.lineWidth = store.brushSize
  if (store.tool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out'
    ctx.strokeStyle = 'rgba(0,0,0,1)'
  } else {
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeStyle = store.color
  }
}

function drawSegment(x1: number, y1: number, x2: number, y2: number) {
  const ctx = getContext()
  if (!ctx) return

  applyStrokeStyle()
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

function syncArtworkSize() {
  const image = imageRef.value
  if (!image) return

  const naturalWidth = image.naturalWidth || 1
  const naturalHeight = image.naturalHeight || 1
  artworkSize.width.value = naturalWidth
  artworkSize.height.value = naturalHeight
  updateArtboardLayout()
}

function beginDraw(event: PointerEvent) {
  const canvas = canvasRef.value
  if (!canvas) return

  event.preventDefault()
  drawing = true
  const point = getPoint(event)
  lastX = point.x
  lastY = point.y
  drawSegment(point.x, point.y, point.x + 0.01, point.y + 0.01)
  canvas.setPointerCapture(event.pointerId)
}

function moveDraw(event: PointerEvent) {
  if (!drawing) return

  event.preventDefault()
  const point = getPoint(event)
  drawSegment(lastX, lastY, point.x, point.y)
  lastX = point.x
  lastY = point.y
}

function endDraw(event: PointerEvent) {
  const canvas = canvasRef.value
  if (!canvas) return

  if (!drawing) return
  drawing = false
  if (canvas.hasPointerCapture(event.pointerId)) {
    canvas.releasePointerCapture(event.pointerId)
  }
}

onMounted(() => {
  const canvas = canvasRef.value
  if (canvas) {
    canvas.addEventListener('pointerdown', beginDraw)
    canvas.addEventListener('pointermove', moveDraw)
    canvas.addEventListener('pointerup', endDraw)
    canvas.addEventListener('pointercancel', endDraw)
  }

  const image = imageRef.value
  if (image) {
    if (image.complete) {
      syncArtworkSize()
    } else {
      image.addEventListener('load', syncArtworkSize, { once: true })
    }
  }

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      updateArtboardLayout()
    })

    if (stageRef.value) {
      resizeObserver.observe(stageRef.value)
    }
  } else {
    window.addEventListener('resize', updateArtboardLayout)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateArtboardLayout)
  resizeObserver?.disconnect()

  const canvas = canvasRef.value
  if (canvas) {
    canvas.removeEventListener('pointerdown', beginDraw)
    canvas.removeEventListener('pointermove', moveDraw)
    canvas.removeEventListener('pointerup', endDraw)
    canvas.removeEventListener('pointercancel', endDraw)
  }
})
</script>

<template>
  <div ref="stageRef" class="drawing-surface">
    <div ref="artboardRef" class="drawing-artboard" :style="artboardStyle">
      <canvas ref="canvasRef" id="paint-canvas" class="stage-paint"></canvas>
      <img
        ref="imageRef"
        id="line-art"
        class="stage-image"
        :src="imagePath"
        :alt="`${animalName} 线稿`"
      />
    </div>
  </div>
</template>
