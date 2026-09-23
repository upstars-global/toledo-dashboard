<script setup lang="ts">
import type { BackstopDiffInfo } from '~~/shared/types'

interface ReportDiffDetailsProps {
  diff?: BackstopDiffInfo
  suppress?: boolean
}

const props = defineProps<ReportDiffDetailsProps>()

const { t } = useI18n()

const show = computed(() => Boolean(props.diff) && !props.suppress)
</script>

<template>
  <div v-if="show && diff" class="inline-flex gap-4">
    <ReportDetailRow :label="t('report.details.diffPercent')">
      {{ diff.misMatchPercentage }}
    </ReportDetailRow>
    <ReportDetailRow :label="t('report.details.diffX')">
      {{ diff.dimensionDifference.width }}
    </ReportDetailRow>
    <ReportDetailRow :label="t('report.details.diffY')">
      {{ diff.dimensionDifference.height }}
    </ReportDetailRow>
  </div>
</template>
