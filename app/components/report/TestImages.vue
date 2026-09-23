<script setup lang="ts">
import type { BackstopImageId, BackstopTestPair, BackstopTestStatus } from '~~/shared/types'

interface ImageList {
  id: BackstopImageId
  label: string
  src?: string
  visible: boolean
  action: () => void
  classes: string
}
interface ReportImagesProps {
  pair?: BackstopTestPair
  status?: BackstopTestStatus
}
const props = defineProps<ReportImagesProps>()

const route = useRoute()
const { apiUrl } = storeToRefs(useConfigStore())
const { settings } = storeToRefs(useReportStore())
const { scrubberOpen } = useScrubberStore()

const images = computed(() => {
  const list: ImageList[] = [
    {
      id: 'refImage',
      label: 'Reference',
      src: `${apiUrl.value}${props.pair?.reference}`,
      visible: settings.value.refImage,
      classes: 'cursor-pointer',
      action: () => scrubberOpen(props.pair, 'refImage')
    },
    {
      id: 'testImage',
      label: 'Test',
      src: `${apiUrl.value}${props.pair?.test}`,
      visible: settings.value.testImage,
      classes: 'cursor-pointer',
      action: () => scrubberOpen(props.pair, 'testImage')
    }
  ]

  if (props.status !== 'pass') {
    list.push({
      id: 'diffImage',
      label: 'Diff',
      src: props.pair?.diffImage
        ? `${apiUrl.value}${props.pair.diffImage}`
        : `${apiUrl.value}/${route.meta.storageType}/no_image.png`,
      visible: settings.value.diffImage,
      classes: props.pair?.diffImage ? 'cursor-pointer' : '',
      action: props.pair?.diffImage ? () => scrubberOpen(props.pair, 'diffImage') : () => {}
    })
  }

  return list.filter((image) => image.visible)
})
</script>

<template>
  <div v-if="images.length" class="relative flex gap-6 pt-2">
    <ReportImagePreview
      v-for="image in images"
      :key="image.id"
      :src="image.src"
      :label="image.label"
      :class="image.classes"
      @select="image.action()"
    />
  </div>
</template>
