<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Application } from '~~/shared/types'

definePageMeta({
  middleware: 'auth',
  breadcrumb: 'envs'
})

const UButton = resolveComponent('UButton')
const ULink = resolveComponent('ULink')

const { t } = useI18n()
const { ui } = useAppConfig()
const route = useRoute()
const { applications } = storeToRefs(useApplicationsStore())
const { globalMismatchThreshold } = storeToRefs(useSettingsStore())
const { reports } = storeToRefs(useReportsStore())
const { refreshReports } = useReportsStore()
const { refreshApps } = useApplicationsStore()
const { showErrorMessage, showSuccessMessage } = useNotifications()
const { user } = useCurrentUser()
const { isReferenceJobRunning } = storeToRefs(useJobsStore())
const { refreshJobsStatus } = useJobsStore()

const modal = reactive({
  startTest: false
})
const selectedApp = ref<Application>()
const misMatchThreshold = ref(globalMismatchThreshold.value)
const table = useTemplateRef('table')
const columnFilters = ref([{ id: 'name', value: '' }])
const sorting = ref([{ id: 'name', desc: false }])

async function handleStartTest() {
  try {
    await $fetch(`/api/${route.params.project}/action/start`, {
      method: 'post',
      body: {
        application: selectedApp.value,
        misMatchThreshold: misMatchThreshold.value,
        userName: user.value?.name
      }
    })
    showSuccessMessage(t('notifications.tests.start'), selectedApp.value?.name)
    toggleStartTestModal()
    await refreshReports()
    await refreshJobsStatus()
  } catch (error) {
    showErrorMessage(error)
    await refreshReports()
    await refreshJobsStatus()
  }
}

function toggleStartTestModal(row?: Application) {
  modal.startTest = !modal.startTest
  selectedApp.value = row
}

const columns: TableColumn<Application>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: t('envs.columns.name'),
        icon: isSorted
          ? isSorted === 'asc'
            ? ui.icons.arrowNarrowUp
            : ui.icons.arrowNarrowDown
          : ui.icons.arrowUpDown,
        class: '-mx-2.5',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
      })
    },
    cell: ({ row }) => {
      return h(ULink, { class: 'font-semibold', external: true, target: '_blank', href: row.original.url }, () =>
        row.getValue('name')
      )
    }
  },
  {
    accessorKey: 'version',
    header: t('envs.columns.version'),
    cell: ({ row }) => {
      const { tag, pipeline } = row.getValue('version') as NonNullable<Application['version']>

      return h('span', { class: 'font-medium' }, `${tag} / ${pipeline}`)
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const appReports = reports.value.filter((r) => {
        const { pipeline } = row.getValue('version') as NonNullable<Application['version']>
        return (r.pipeline && pipeline?.includes(r.pipeline)) || row.original.name?.includes(r.branchName)
      })
      const dates = appReports.map((r) => new Date(r.createDate).getTime())
      const report = appReports.find((r) => new Date(r.createDate).getTime() === Math.max(...dates))

      return h('div', { class: 'flex flex-wrap gap-4 lg:gap-6 justify-between sm:justify-end' }, [
        report
          ? h(UButton, {
              label: t('actions.showReport'),
              variant: 'outline',
              color: 'secondary',
              to: `/${route.params.project}/reports/${report.id}`
            })
          : undefined,
        h(UButton, {
          label: t('actions.startTest'),
          disabled: isReferenceJobRunning.value,
          onClick: () => toggleStartTestModal(row.original)
        })
      ])
    }
  }
]
</script>

<template>
  <UiDashboardContent class="pb-24 h-full">
    <UPageGrid id="project-envs" class="h-full">
      <UPageCard
        class="col-span-3 h-full overflow-auto"
        :ui="{ header: 'w-full mb-0', container: 'lg:flex', wrapper: 'flex-0' }"
      >
        <template #header>
          <div class="w-full flex flex-wrap gap-2 justify-between">
            <UInput
              :model-value="table?.tableApi?.getColumn('name')?.getFilterValue() as string"
              class="max-w-sm"
              :placeholder="t('global.filter')"
              @update:model-value="table?.tableApi?.getColumn('name')?.setFilterValue($event)"
            />
            <UButton :label="t('actions.refreshApps')" :icon="ui.icons.reload" variant="ghost" @click="refreshApps" />
          </div>
        </template>
        <UTable
          ref="table"
          v-model:column-filters="columnFilters"
          v-model:sorting="sorting"
          class="border-t border-accented"
          :columns="columns"
          :data="applications"
          :ui="{
            tr: 'grid sm:grid-cols-2 lg:table-row',
            td: 'nth-1:whitespace-pre-wrap'
          }"
        />
      </UPageCard>
    </UPageGrid>
    <UModal
      v-model:open="modal.startTest"
      :title="t('modal.startTest.title')"
      :description="t('modal.startTest.description', { name: selectedApp?.name })"
      :ui="{ footer: 'justify-end' }"
    >
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
      </template>
      <template #footer>
        <UButton color="primary" :label="t(`actions.startTest`)" @click="handleStartTest()" />
        <UButton color="neutral" variant="outline" :label="t('actions.cancel')" @click="() => toggleStartTestModal()" />
      </template>
    </UModal>
  </UiDashboardContent>
</template>
