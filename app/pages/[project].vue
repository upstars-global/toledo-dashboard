<script setup lang="ts">
import type { JobStatusMessage } from '#shared/types'

const { getProjectNavigation } = useNavigationStore()

const { t } = useI18n()
const { $bus } = useNuxtApp()
const route = useRoute()
const { showErrorMessage, showSuccessMessage } = useNotifications()
const { refreshJobsStatus } = useJobsStore()
const { refreshReports } = useReportsStore()

const links = computed(() => {
  if (!route.params.project) {
    return []
  }
  return getProjectNavigation(route.params.project as string)
})

async function jobReferenceStatus(message: JobStatusMessage) {
  await refreshJobsStatus()
  await refreshReports()

  switch (message.status) {
    case 'queued':
      showSuccessMessage(t('notifications.references.added'))
      break
    case 'active':
      showSuccessMessage(t('notifications.references.start'))
      break
    case 'completed':
      showSuccessMessage(t('notifications.references.finish'))
      break
    case 'failed':
      showErrorMessage(message.error || t('notifications.references.failed'))
      break
    case 'error':
      showErrorMessage(message.error || t('notifications.references.failed'))
      break
  }
}

async function jobTestStatus(message: JobStatusMessage) {
  await refreshJobsStatus()
  await refreshReports()

  switch (message.status) {
    case 'queued':
      showSuccessMessage(t('notifications.tests.added'), message.appName)
      break
    case 'active':
      showSuccessMessage(t('notifications.tests.start'), message.appName)
      break
    case 'completed':
      showSuccessMessage(t('notifications.tests.finish'), message.appName)
      break
    case 'failed':
      showErrorMessage(message.error || t('notifications.tests.failed'))
      break
    case 'error':
      showErrorMessage(message.error || t('notifications.tests.failed'))
      break
  }
}

onMounted(() => {
  $bus.on('job:reference', jobReferenceStatus)
  $bus.on('job:test', jobTestStatus)
})

onBeforeUnmount(() => {
  $bus.off('job:reference', jobReferenceStatus)
  $bus.off('job:test', jobTestStatus)
})
</script>

<template>
  <main class="h-full flex flex-col">
    <UDashboardToolbar :ui="{ root: 'overflow-x-auto' }">
      <template #left>
        <UNavigationMenu orientation="horizontal" :items="links" />
      </template>
    </UDashboardToolbar>
    <NuxtPage />
  </main>
</template>
