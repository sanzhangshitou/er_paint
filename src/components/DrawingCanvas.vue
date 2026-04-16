<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { usePaintStore } from '@/stores/paint'

const props = defineProps<{
  imagePath: string
  animalName: string
}>()

const store = usePaintStore()

const stageRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const imageRef = ref<HTMLImageElement | null>(null)

let drawing = false
let lastX = 0
let lastY = 0

function resizeCanvas() {
  const canvas = canvasRef.value
  const stage = stageRef.value
  if (!canvas || !stage) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const ratio = Math.max(window.devicePixelRatio || 1, 1)
  const rect = stage.getBoundingClientRect()

  // 保存现有内容
  const snapshot = document.createElement('canvas')
  snapshot.width = canvas.width
  snapshot.height = canvas.height
  snapshot.getContext('2d')?.drawImage(canvas, 0, 0)

  canvas.width = Math.max(1, Math.floor(rect.width * ratio))
  canvas.height = Math.max(1, Math.floor(rect.height * ratio))
  canvas.style.width = `${rect.width}px`
  canvas.style.height = `${rect.height}px`

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.scale(ratio, ratio)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  if (snapshot.width > 0 && snapshot.height > 0) {
    ctx.drawImage(snapshot, 0, 0, rect.width, rect.height)
  }
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
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
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
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  applyStrokeStyle()
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

function beginDraw(event: PointerEvent) {
  const canvas = canvasRef.value
  if (!canvas) return

  drawing = true
  const point = getPoint(event)
  lastX = point.x
  lastY = point.y
  drawSegment(point.x, point.y, point.x + 0.01, point.y + 0.01)
  canvas.setPointerCapture(event.pointerId)
}

function moveDraw(event: PointerEvent) {
  if (!drawing) return
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
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  const canvas = canvasRef.value
  if (canvas) {
    canvas.addEventListener('pointerdown', beginDraw)
    canvas.addEventListener('pointermove', moveDraw)
    canvas.addEventListener('pointerup', endDraw)
    canvas.addEventListener('pointerleave', endDraw)
    canvas.addEventListener('pointercancel', endDraw)
  }

  const image = imageRef.value
  if (image) {
    image.addEventListener('load', resizeCanvas, { once: true })
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<template>
  <canvas ref="canvasRef" id="paint-canvas" class="stage-paint"></canvas>
  <img
    ref="imageRef"
    id="line-art"
    class="stage-image"
    :src="imagePath"
    :alt="`${animalName} 线稿`"
  />
</template>
