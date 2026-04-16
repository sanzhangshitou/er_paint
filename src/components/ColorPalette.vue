<script setup lang="ts">
import { usePaintStore } from '@/stores/paint'

const store = usePaintStore()
</script>

<template>
  <div class="palette-grid">
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
</template>
