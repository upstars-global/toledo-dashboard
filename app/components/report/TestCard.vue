<script setup lang="ts">
import type { BackstopTestReport } from '~~/shared/types'

interface ReportTestCardProps {
  test: BackstopTestReport
  index: number
  lastIndex: number
}

const props = defineProps<ReportTestCardProps>()

const { t } = useI18n()
const { settingOnlyText } = storeToRefs(useReportStore())
const { scrubberOpen } = useScrubberStore()

const hasDiff = computed(() => Boolean(props.test.pair?.diffImage))
const borderColor = computed(() => {
  switch (props.test.status) {
    case 'pass':
      return 'border-s-success'
    case 'fail':
      return 'border-s-warning'
    case 'broken':
      return 'border-s-error'
    default:
      return 'border-s-neutral'
  }
})
</script>

<template>
  <div
    :id="`test-${index}`"
    class="relative my-2 min-h-10 scroll-mt-28 break-inside-avoid border-s-6 bg-accented px-6 py-4 shadow-md"
    :class="borderColor"
  >
    <ReportTextDetails :pair="test.pair" />

    <div class="sm:absolute pb-4 inset-e-2.5 top-3.5 flex items-center justify-end gap-2.5">
      <UButton
        v-if="hasDiff"
        color="neutral"
        variant="subtle"
        :label="t('report.showDiff')"
        class="uppercase"
        @click="scrubberOpen(test.pair)"
      />
      <ReportNavButtons v-if="!settingOnlyText" :current-id="index" :last-id="lastIndex" />
    </div>

    <ReportTestImages :pair="test.pair" :status="test.status" />
    <ReportErrorMessages :pair="test.pair" />
  </div>
</template>
