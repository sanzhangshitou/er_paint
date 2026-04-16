<script setup lang="ts">
import { usePaintStore } from '@/stores/paint'

const store = usePaintStore()
</script>

<template>
  <div class="tool-switcher">
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

    <button
      class="tool-button icon-tool"
      :class="{ active: store.tool === 'eraser' }"
      type="button"
      aria-label="橡皮"
      @click="store.selectTool('eraser')"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m8 6 10 10" />
        <path d="m6 14 6-6c1-1 2.5-1 3.5 0l2.5 2.5c1 1 1 2.5 0 3.5l-3 3H9c-1 0-2-.4-3-.9z" />
        <path d="M4 18h14" />
      </svg>
    </button>
  </div>

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
</template>
