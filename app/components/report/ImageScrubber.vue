<script setup lang="ts">
import type { ScrubberMode } from '~~/shared/types'

interface Mode {
  id: ScrubberMode
  label: string
  action: () => void
}

const { t } = useI18n()
const { apiUrl } = storeToRefs(useConfigStore())
const { pair, testImageType, mode, position } = storeToRefs(useScrubberStore())
const { scrubberShowReference, scrubberShowTest, scrubberShowDiff, scrubberShowScrub } = useScrubberStore()

const refImageMissing = ref(false)

const hasDiff = computed(() => Boolean(pair.value?.diffImage))

/** Which bitmap the slider reveals on its right-hand side. */
const comparisonSrc = computed(() => (testImageType.value === 'diffImage' ? pair.value?.diffImage : pair.value?.test))

/** The React version fell back to a plain diff image in these cases. */
const showSliderView = computed(() => hasDiff.value && !refImageMissing.value)

const modes: Mode[] = [
  { id: 'SHOW_SCRUBBER_REF_IMAGE', label: t('report.scrubberMode.reference'), action: () => scrubberShowReference() },
  { id: 'SHOW_SCRUBBER_TEST_IMAGE', label: t('report.scrubberMode.test'), action: () => scrubberShowTest() },
  { id: 'SHOW_SCRUBBER_DIFF_IMAGE', label: t('report.scrubberMode.diff'), action: () => scrubberShowDiff() },
  { id: 'SCRUB', label: t('report.scrubberMode.scrubber'), action: () => scrubberShowScrub() }
]

function getImageSrc(src?: string) {
  return `${apiUrl.value}${src}`
}

watch(
  () => pair.value,
  () => {
    refImageMissing.value = false
  }
)
</script>

<template>
  <div v-if="pair">
    <div v-if="hasDiff" class="sticky top-0 z-10 flex justify-center gap-4 border-b border-accented bg-muted py-2.5">
      <UButton
        v-for="item in modes"
        :key="item.id"
        color="neutral"
        :variant="mode === item.id ? 'solid' : 'subtle'"
        class="uppercase"
        :label="item.label"
        @click="item.action()"
      />
    </div>

    <div class="overflow-hidden pb-5">
      <template v-if="!showSliderView">
        <img
          v-if="mode === 'SHOW_SCRUBBER_REF_IMAGE'"
          :src="getImageSrc(pair.reference)"
          alt="Reference image"
          class="mx-auto block"
        />
        <img
          v-if="mode === 'SHOW_SCRUBBER_TEST_IMAGE'"
          :src="getImageSrc(pair.test)"
          alt="Test image"
          class="mx-auto block"
        />
        <img
          v-if="mode === 'SHOW_SCRUBBER_DIFF_IMAGE'"
          :src="getImageSrc(pair.diffImage)"
          alt="Diff image"
          class="mx-auto block"
        />
      </template>

      <ReportCompareSlider
        v-else
        :position="position"
        :before-src="getImageSrc(pair.reference)"
        :after-src="getImageSrc(comparisonSrc)"
        :after-alt="testImageType === 'diffImage' ? 'Diff image' : 'Test image'"
        @error="refImageMissing = true"
      />
    </div>
  </div>
</template>
