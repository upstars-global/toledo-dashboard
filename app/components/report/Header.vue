<script setup lang="ts">
import type { BackstopReport } from '~~/shared/types'

interface ReportHeaderProps {
  report: BackstopReport
}

const props = defineProps<ReportHeaderProps>()

const { t } = useI18n()
const { ui } = useAppConfig()
const route = useRoute()

const date = computed(() => {
  return new Date(props.report.createDate ?? '').toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
})
const status = computed(() => props.report.result.status)
const statusColor = computed(() => {
  if (!status.value) {
    return 'neutral'
  }

  return {
    crashed: 'error' as const,
    error: 'error' as const,
    passed: 'success' as const,
    failed: 'warning' as const,
    pending: 'neutral' as const,
    unknown: 'error' as const
  }[status.value]
})
</script>

<template>
  <UPageHeader
    :title="report.branchName"
    :headline="t(`report.headline.${route.meta.storageType}`)"
    :ui="{
      root: 'p-4 sm:p-6 bg-elevated border-accented',
      container: 'flex flex-wrap items-center justify-between gap-x-4 gap-y-2',
      links: 'gap-2',
      description: 'mt-0 hidden lg:flex',
      headline: 'mb-1'
    }"
  >
    <template #links>
      <UBadge variant="subtle" :color="statusColor" :label="t(`reports.status.${status}`)" />
      <div class="flex flex-wrap items-center gap-2 text-sm text-pretty text-muted">
        <span class="border-l-2 border-muted pl-2">{{ date }}</span>
        <span class="border-l-2 border-muted pl-2">{{ t('report.createdBy', { createdBy: report.createdBy }) }}</span>
      </div>
    </template>
    <template #description>
      <UIcon :name="ui.icons.image" class="size-8 text-primary" />
    </template>
    <div class="w-full flex flex-wrap items-center gap-2">
      <UBadge color="neutral" variant="subtle" :label="t('report.environment', { environment: report.environment })" />
      <UBadge color="neutral" variant="subtle" :label="t('report.pipeline', { pipeline: report.pipeline })" />
    </div>
  </UPageHeader>
</template>
