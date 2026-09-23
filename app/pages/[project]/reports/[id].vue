<script setup lang="ts">
import type { BackstopReport } from '~~/shared/types'

definePageMeta({
  middleware: 'auth',
  storageType: 'reports'
})

const { t } = useI18n()
const route = useRoute()
const { settings } = storeToRefs(useReportStore())
const { settingsRestore, settingsPersist } = useReportStore()
const { showErrorMessage } = useNotifications()

const { data: report, error } = useFetch<BackstopReport | null>(`/api/${route.params.project}/report`, {
  query: { reportId: route.params.id, storageType: route.meta.storageType },
  default: () => null
})

if (error.value) {
  showErrorMessage(error.value)
}

watch(
  () => settings.value,
  () => settingsPersist(),
  { deep: true }
)

onMounted(() => {
  settingsRestore()
})
</script>

<template>
  <div class="flex-1 flex flex-col overflow-y-auto pb-24 h-full">
    <div v-if="!report" class="p-4 sm:p-6 m-auto text-muted">{{ t('report.loading') }}</div>
    <ReportContainer v-else :report="report" />
  </div>
</template>
