<script setup lang="ts">
import type { BackstopTestReport } from '~~/shared/types'

interface ReportTestListProps {
  tests?: BackstopTestReport[]
}

const props = defineProps<ReportTestListProps>()

const { t } = useI18n()
const { filterStatus, filterQuery } = storeToRefs(useReportStore())
const { setFilteredCount } = useReportStore()

const filteredTests = computed(() => {
  const needle = filterQuery.value.trim().toLowerCase()

  if (!props.tests) {
    return []
  }

  return props.tests?.filter((test) => {
    if (filterStatus.value !== 'all' && test.status !== filterStatus.value) {
      return false
    }
    if (!needle) {
      return true
    }

    return (
      test.pair?.label?.toLowerCase().includes(needle)
      || test.pair?.label
        ?.split(/(?=[A-Z])/)
        .join(' ')
        .toLowerCase()
        .includes(needle)
        || test.pair?.viewportLabel?.toLowerCase().includes(needle)
    )
  })
})

watch(
  () => filteredTests.value,
  () => {
    const count = props.tests?.length === filteredTests.value?.length ? 0 : filteredTests.value?.length
    setFilteredCount(count)
  }
)
</script>

<template>
  <section class="w-full">
    <ReportTestCard
      v-for="(test, index) in filteredTests"
      :key="test.pair?.fileName ?? `test-${index}`"
      :test="test"
      :index="index"
      :last-index="filteredTests.length - 1"
    />

    <div v-if="!filteredTests.length" class="py-16 text-center">
      <p class="text-dimmed">{{ t('report.filter.noResult') }}</p>
    </div>
  </section>
</template>
