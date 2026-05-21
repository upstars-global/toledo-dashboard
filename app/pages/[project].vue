<script setup lang="ts">
import type { JobStatusEvents } from '~~/shared/types'

const { getProjectNavigation } = useNavigationStore()

const { t } = useI18n()
const { $bus } = useNuxtApp()
const route = useRoute()
const { projectsList } = storeToRefs(useConfigStore())
const { showErrorMessage, showSuccessMessage } = useNotifications()
const { refreshJobsStatus } = useJobsStore()
const { refreshReports } = useReportsStore()

const links = computed(() => {
  if (!route.params.project) {
    return []
  }
  return getProjectNavigation(route.params.project as string)
})

async function jobReferenceStatus(payload: JobStatusEvents) {
  await refreshJobsStatus()
  await refreshReports()

  const { label, message } = payload

  switch (message.status) {
    case 'queued':
      showSuccessMessage(label, t('notifications.references.added'))
      break
    case 'active':
      showSuccessMessage(label, t('notifications.references.start'))
      break
    case 'completed':
      showSuccessMessage(label, t('notifications.references.finish'))
      break
    case 'failed':
      showErrorMessage(message.error || t('notifications.references.failed'))
      break
    case 'error':
      showErrorMessage(message.error || t('notifications.references.failed'))
      break
  }
}

async function jobTestStatus(payload: JobStatusEvents) {
  await refreshJobsStatus()
  await refreshReports()

  const { label, message } = payload

  switch (message.status) {
    case 'queued':
      showSuccessMessage(`${label} - ${message.appName}`, t('notifications.tests.added'))
      break
    case 'active':
      showSuccessMessage(`${label} - ${message.appName}`, t('notifications.tests.start'))
      break
    case 'completed':
      showSuccessMessage(`${label} - ${message.appName}`, t('notifications.tests.finish'))
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
  projectsList.value.forEach((project) => {
    $bus.on(`${project.id}:job:reference`, jobReferenceStatus)
    $bus.on(`${project.id}:job:test`, jobTestStatus)
  })
})

onBeforeUnmount(() => {
  projectsList.value.forEach((project) => {
    $bus.off(`${project.id}:job:reference`, jobReferenceStatus)
    $bus.off(`${project.id}:job:test`, jobTestStatus)
  })
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
