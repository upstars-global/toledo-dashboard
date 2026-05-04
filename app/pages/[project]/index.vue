<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { DiskSpace, FormatedBytes, JobStatus, SelectedApp } from '~~/shared/types'
import type { CommandPaletteGroup, ProgressProps, TableColumn } from '@nuxt/ui'

definePageMeta({
  middleware: 'auth'
})

const UBadge = resolveComponent('UBadge')
const ULink = resolveComponent('ULink')

const { t } = useI18n()
const { ui } = useAppConfig()
const route = useRoute()
const { showErrorMessage, showSuccessMessage } = useNotifications()
const { isReferenceJobRunning, jobsStatus } = storeToRefs(useJobsStore())
const { refreshJobsStatus } = useJobsStore()
const { dynamicAppsList, persistentAppsList } = storeToRefs(useApplicationsStore())
const { globalMismatchThreshold } = storeToRefs(useSettingsStore())
const { refreshApps } = useApplicationsStore()
const { refreshReports } = useReportsStore()
const { user } = useCurrentUser()

const { data: diskSpaceData, error: diskSpaceError } = await useFetch<DiskSpace<FormatedBytes> | null>(
  `/api/${route.params.project}/disk-space`
)

if (diskSpaceError.value) {
  showErrorMessage(diskSpaceError.value)
}

function getPercentOf(value: number, total: number) {
  const percent = (value / total) * 100
  const factor = Math.pow(10, 2)

  return Math.round(percent * factor) / factor
}

const modal = reactive({
  startTest: false,
  createReference: false
})
const searchQuery = ref('')
const selectedApp = ref<SelectedApp | null>(null)
const misMatchThreshold = ref(globalMismatchThreshold.value)

const storageUsedPercent = computed(() => {
  const { capacity, used } = diskSpaceData.value || {}
  if (used?.bytes && capacity?.bytes) {
    return getPercentOf(used.bytes, capacity.bytes)
  }

  return 0
})
const storageText = computed(() => {
  const { capacity, used } = diskSpaceData.value || {}
  if (used?.text && capacity?.text) {
    return t('controlPanel.diskUsage.used', {
      capacity: capacity.text,
      used: used.text
    })
  }

  return ''
})
const storageColor = computed(() => {
  let color: ProgressProps['color'] = 'info'

  if (storageUsedPercent.value >= 50 && storageUsedPercent.value <= 74) {
    color = 'warning'
  }

  if (storageUsedPercent.value >= 75) {
    color = 'error'
  }

  return color
})

function toggleStartTestModal() {
  modal.startTest = !modal.startTest
  selectedApp.value = null
}

function toggleCreateReferenceModal() {
  modal.createReference = !modal.createReference
}
function getApplicationsInfo(): CommandPaletteGroup[] {
  return [
    {
      id: 'persistentAppsList',
      label: searchQuery.value
        ? t('modal.startSelectedTest.apps.persistent.matching', { query: searchQuery.value })
        : t('modal.startSelectedTest.apps.persistent.label'),
      items: persistentAppsList.value.map((app) => ({
        label: app.name,
        description: `${app.version?.tag} / ${app.version?.pipeline}`,
        app
      }))
    },
    {
      id: 'dynamicAppsList',
      label: searchQuery.value
        ? t('modal.startSelectedTest.apps.dynamic.matching', { query: searchQuery.value })
        : t('modal.startSelectedTest.apps.dynamic.label'),
      items: dynamicAppsList.value.map((app) => ({ label: app.name, app }))
    }
  ]
}

async function handleStartTest() {
  try {
    await $fetch(`/api/${route.params.project}/action/start`, {
      method: 'post',
      body: {
        application: selectedApp.value?.app,
        misMatchThreshold: misMatchThreshold.value,
        userName: user.value?.name
      }
    })
    showSuccessMessage(t('notifications.tests.start'))
    toggleStartTestModal()
    await refreshJobsStatus()
    await refreshReports()
  } catch (error) {
    showErrorMessage(error)
    await refreshJobsStatus()
    await refreshReports()
  }
}
async function handleCreateReferences() {
  try {
    await $fetch(`/api/${route.params.project}/action/reference`, {
      method: 'post',
      body: {
        userName: user.value?.name
      }
    })
    showSuccessMessage(t('notifications.references.start'))
    toggleCreateReferenceModal()
    await refreshJobsStatus()
  } catch (error) {
    showErrorMessage(error)
    await refreshJobsStatus()
  }
}

function getStatusBadge(status: JobStatus['state']) {
  const color = {
    'active': 'warning' as const,
    'completed': 'success' as const,
    'delayed': 'neutral' as const,
    'failed': 'error' as const,
    'prioritized': 'neutral' as const,
    'waiting': 'info' as const,
    'waiting-children': 'info' as const
  }[status]

  return h(UBadge, { variant: 'subtle', color }, () => {
    return t(`controlPanel.jobs.status.${status}`)
  })
}

const columns: TableColumn<JobStatus>[] = [
  {
    accessorKey: 'id',
    header: 'Environment',
    cell: ({ row }) => {
      if (row.original.name === 'reference') {
        const url = row.original.state === 'completed' ? `/${route.params.project}/references` : undefined
        return h(ULink, { class: 'font-semibold', to: url }, () => {
          const [task] = row.original.id.split('-') as string[]
          return task
        })
      }

      const url = row.original.state === 'completed' ? `/${route.params.project}/reports/${row.original.id}` : undefined
      return h(ULink, { class: 'font-semibold', to: url }, () => {
        const [env, tag, pipeline] = row.original.id.split('_') as string[]
        return `${tag} / ${pipeline} / ${env}`
      })
    }
  },
  {
    accessorKey: 'name',
    header: 'Type',
    cell: ({ row }) => row.original.name
  },
  {
    accessorKey: 'state',
    header: 'Status',
    cell: ({ row }) => getStatusBadge(row.getValue('state'))
  },
  {
    accessorKey: 'timestamp',
    header: 'Created',
    cell: ({ row }) => {
      if (!row.original.timestamp) {
        return '-'
      }

      return new Date(row.original.timestamp).toLocaleString('uk')
    }
  },
  {
    accessorKey: 'processedOn',
    header: 'Started',
    cell: ({ row }) => {
      if (!row.original.processedOn) {
        return '-'
      }

      return new Date(row.original.processedOn).toLocaleString('uk')
    }
  },
  {
    accessorKey: 'finishedOn',
    header: 'Finished',
    cell: ({ row }) => {
      if (!row.original.finishedOn) {
        return '-'
      }

      return new Date(row.original.finishedOn).toLocaleString('uk')
    }
  }
]
</script>

<template>
  <UiDashboardContent class="pb-24 h-full gap-2 lg:gap-4">
    <UPageGrid id="control-panel" class="gap-2 lg:gap-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 items-start">
      <UPageCard v-bind="ui.presets.pageCard.space" :icon="ui.icons.hardDrive">
        <template #header>
          <span>{{ t('controlPanel.diskUsage.title') }}</span>
        </template>
        <template #body>
          <div class="flex flex-col gap-2">
            <UProgress :model-value="storageUsedPercent" :color="storageColor" :max="100" />
            <div class="flex gap-2 justify-between items-center text-muted text-sm text-pretty">
              <span>{{ `${storageUsedPercent}%` }}</span>
              <span>{{ storageText }}</span>
            </div>
          </div>
          <USeparator class="my-2" />
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(folder, key) in diskSpaceData?.folders"
              :key="key"
              class="flex gap-1 items-center text-xs text-pretty"
            >
              <UBadge
                variant="subtle"
                color="secondary"
                :label="t(`controlPanel.diskUsage.${key}`, { text: folder?.text })"
              />
            </div>
          </div>
        </template>
      </UPageCard>
      <UPageCard v-bind="ui.presets.pageCard.space" :icon="ui.icons.controlPanel">
        <template #header>
          <span>{{ t('controlPanel.actions.title') }}</span>
        </template>
        <template #body>
          <div class="flex flex-wrap gap-2">
            <UButton
              :label="t('actions.createReference', 2)"
              :disabled="isReferenceJobRunning"
              @click="toggleCreateReferenceModal"
            />
            <UButton :label="t('actions.startTest')" :disabled="isReferenceJobRunning" @click="toggleStartTestModal" />
          </div>
        </template>
      </UPageCard>
    </UPageGrid>
    <UPageGrid id="control-panel-jobs" class="h-full">
      <UPageCard
        :title="t('controlPanel.jobs.title')"
        class="col-span-3 h-full overflow-auto"
        :ui="{ body: 'w-full', container: 'lg:flex', wrapper: 'flex-0' }"
      >
        <template #title>
          <div class="w-full flex flex-wrap gap-2 items-center justify-between">
            <span>{{ t('controlPanel.jobs.title') }}</span>
            <UButton
              :label="t('actions.refreshJobs')"
              :icon="ui.icons.reload"
              variant="ghost"
              @click="refreshJobsStatus()"
            />
          </div>
        </template>
        <UTable ref="tableRef" class="border-t border-accented" :data="jobsStatus" :columns="columns" />
      </UPageCard>
    </UPageGrid>
    <UModal v-model:open="modal.startTest" :title="t('modal.startTest.title')" :ui="{ footer: 'justify-end' }">
      <template #body>
        <UFormField :label="t('modal.startTest.misMatchThreshold')">
          <UInputNumber
            v-model="misMatchThreshold"
            class="w-full"
            :min="0"
            :max="100"
            :step="0.01"
            :placeholder="t('modal.startTest.misMatchThresholdPlaceholder')"
          />
        </UFormField>
        <USeparator class="my-4" />
        <UPageHeader :headline="t('modal.startSelectedTest.headline')" :ui="{ root: 'py-0', headline: 'mb-2' }" />
        <UCommandPalette
          v-model:search-term="searchQuery"
          v-model="selectedApp"
          :groups="getApplicationsInfo()"
          :placeholder="t('modal.startSelectedTest.searchPlaceholder')"
          class="max-h-64"
        >
          <template #close>
            <UButton
              :icon="ui.icons.reload"
              :title="t('modal.startSelectedTest.refresh')"
              color="neutral"
              variant="ghost"
              @click="refreshApps()"
            />
          </template>
        </UCommandPalette>
      </template>
      <template #footer>
        <UButton color="primary" :label="t(`actions.startTest`)" @click="handleStartTest" />
        <UButton color="neutral" variant="outline" :label="t('actions.cancel')" @click="toggleStartTestModal" />
      </template>
    </UModal>
    <UModal
      v-model:open="modal.createReference"
      :title="t('modal.createReference.title', 2)"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <span>{{ t('modal.createReference.common') }}</span>
      </template>
      <template #footer>
        <UButton color="primary" :label="t(`actions.createReference`, 2)" @click="handleCreateReferences" />
        <UButton color="neutral" variant="outline" :label="t('actions.cancel')" @click="toggleCreateReferenceModal" />
      </template>
    </UModal>
  </UiDashboardContent>
</template>
