<script setup lang="ts">
interface ReportCompareSliderProps {
  position?: number
  beforeSrc?: string
  afterSrc?: string
  beforeAlt?: string
  afterAlt?: string
}

const props = withDefaults(defineProps<ReportCompareSliderProps>(), {
  position: 50,
  beforeAlt: 'Reference image',
  afterAlt: 'Test image'
})

const emit = defineEmits<{ error: [] }>()

const root = ref<HTMLElement | null>(null)
const offset = ref(props.position)
const dragging = ref(false)

watch(
  () => props.position,
  (next) => {
    offset.value = next
  }
)

const clamped = computed(() => Math.min(100, Math.max(0, offset.value)))

function moveTo(clientX: number) {
  const rect = root.value?.getBoundingClientRect()

  if (!rect || rect.width === 0) {
    return
  }

  offset.value = ((clientX - rect.left) / rect.width) * 100
}

function onPointerDown(event: PointerEvent) {
  dragging.value = true
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
  moveTo(event.clientX)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value) {
    return
  }

  moveTo(event.clientX)
}

function onPointerUp() {
  dragging.value = false
}
</script>

<template>
  <div
    ref="root"
    class="relative mx-8 cursor-ew-resize touch-none select-none overflow-hidden whitespace-nowrap"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div
      class="inline-flex justify-center w-full relative align-top overflow-hidden"
      :style="{ left: `${clamped - 100}%` }"
    >
      <div class="relative text-center" :style="{ right: `${clamped - 100}%` }">
        <img :src="beforeSrc" :alt="beforeAlt" class="inline max-w-full" draggable="false" @error="emit('error')" />
      </div>
    </div>

    <div
      class="inline-flex justify-center w-full relative align-top overflow-hidden"
      :style="{ left: `${clamped - 100}%` }"
    >
      <div class="relative text-center" :style="{ right: `${clamped}%` }">
        <img class="inline max-w-full" :src="afterSrc" :alt="afterAlt" draggable="false" />
      </div>
    </div>

    <div
      :class="['absolute top-0 h-full w-1.5 bg-primary', { '-translate-x-1.5': clamped === 100 }]"
      :style="{ left: `${clamped}%` }"
    />
  </div>
</template>
