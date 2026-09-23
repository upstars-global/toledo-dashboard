<script setup lang="ts">
import type { BackstopTestReport, BackstopTestStatus } from '~~/shared/types'
import type { ButtonProps } from '@nuxt/ui'

interface ReportTestListProps {
  tests?: BackstopTestReport[]
}

type Filters = {
  id: BackstopTestStatus | 'all'
  label: string
  count?: number
  color: ButtonProps['color']
}

const props = defineProps<ReportTestListProps>()

const { t } = useI18n()
const { ui } = useAppConfig()
const { filterStatus, filterQuery, filteredCount } = storeToRefs(useReportStore())
const { setFilterStatus } = useReportStore()

const filters = computed<Filters[]>(() => {
  if (!props.tests || !props.tests.length) {
    return []
  }

  return [
    { id: 'all', label: t('reports.result.count'), count: props.tests?.length, color: 'neutral' },
    {
      id: 'pass',
      label: t('reports.result.passed'),
      count: props.tests?.filter((t) => t.status === 'pass').length,
      color: 'success'
    },
    {
      id: 'fail',
      label: t('reports.result.failed'),
      count: props.tests?.filter((t) => t.status === 'fail').length,
      color: 'warning'
    },
    {
      id: 'broken',
      label: t('reports.result.broken'),
      count: props.tests?.filter((t) => t.status === 'broken').length,
      color: 'error'
    }
  ]
})
</script>

<template>
  <UDashboardToolbar class="sticky py-4 top-0 z-5 bg-elevated gap-4 border-accented" :ui="{ root: 'flex-wrap' }">
    <div class="flex shrink-0 gap-2">
      <UButton
        v-for="filter in filters"
        :key="filter.id"
        :color="filter.color"
        :variant="filterStatus === filter.id ? 'solid' : 'outline'"
        @click="setFilterStatus(filter.id)"
      >
        <span class="tabular-nums">{{ filter.count }}</span>
        {{ filter.label }}
      </UButton>
    </div>
    <div class="flex grow gap-4">
      <UInput
        v-model="filterQuery"
        :icon="ui.icons.search"
        class="grow"
        :ui="{ root: 'w-full' }"
        :placeholder="t('report.filter.placeholder')"
      >
        <template v-if="filteredCount" #trailing>
          <div id="character-count" class="text-xs text-muted tabular-nums">
            {{ filteredCount }}/{{ tests?.length }}
          </div>
        </template>
      </UInput>
      <ReportLayoutSettings />
    </div>
  </UDashboardToolbar>
</template>
