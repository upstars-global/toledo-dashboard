<script setup lang="ts">
import type { BackstopTestPair } from '~~/shared/types'

interface ReportDetailsProps {
  pair?: BackstopTestPair
}

defineProps<ReportDetailsProps>()

const { t } = useI18n()
const { settings } = storeToRefs(useReportStore())
const hasDetailsPanel = computed(() => !settings.value.textInfo)
</script>

<template>
  <div class="pb-4">
    <div class="py-1">
      <UPopover v-if="hasDetailsPanel" mode="hover" :content="{ align: 'start', side: 'bottom' }">
        <div class="cursor-help inline-flex flex-wrap gap-2 sm:gap-4">
          <ReportDetailRow :label="t('report.details.label')">
            {{ pair?.label?.split(/(?=[A-Z])/).join(' ') }}
          </ReportDetailRow>
          <ReportDetailRow :label="t('report.details.viewportLabel')">{{ pair?.viewportLabel }}</ReportDetailRow>
          <ReportDetailRow :label="t('report.details.selector')">{{ pair?.selector }}</ReportDetailRow>
        </div>
        <template #content>
          <div class="space-y-4 p-4">
            <ReportDetailRow :label="t('report.details.filename')">{{ pair?.fileName }}</ReportDetailRow>
            <div class="flex flex-wrap gap-y-1.5">
              <ReportDiffDetails :diff="pair?.diff" />
            </div>
          </div>
        </template>
      </UPopover>
      <template v-else>
        <div class="inline-flex flex-wrap gap-2 sm:gap-4">
          <ReportDetailRow :label="t('report.details.label')">
            {{ pair?.label?.split(/(?=[A-Z])/).join(' ') }}
          </ReportDetailRow>
          <ReportDetailRow :label="t('report.details.viewportLabel')">{{ pair?.viewportLabel }}</ReportDetailRow>
          <ReportDetailRow :label="t('report.details.selector')">{{ pair?.selector }}</ReportDetailRow>
        </div>
      </template>
    </div>

    <div v-if="settings.textInfo" class="py-1">
      <ReportDetailRow :label="t('report.details.filename')">{{ pair?.fileName }}</ReportDetailRow>
    </div>
    <ReportDiffDetails :diff="pair?.diff" :suppress="!settings.textInfo" />
  </div>
</template>
