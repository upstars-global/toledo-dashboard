<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { FormatedBytes, Report } from '~~/shared/types'
import { DEFAULT_DELETE_TIMEOUT } from '~~/shared/constants'

definePageMeta({
  middleware: 'auth',
  breadcrumb: 'reports'
})

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')

const { t } = useI18n()
const { ui } = useAppConfig()
const route = useRoute()
const { reports } = storeToRefs(useReportsStore())
const { refreshReports } = useReportsStore()
const { showErrorMessage, showSuccessMessage } = useNotifications()

const loading = ref(false)
const backupModel = ref<Report>()
const deleteModel = ref<Report>()
const modal = reactive({
  backup: false,
  bulkBackup: false,
  bulkDelete: false,
  delete: false
})

const selectedRows = ref<Record<string, boolean | undefined>>({})

const tableRef = useTemplateRef('tableRef')
const columnFilters = ref([{ id: 'branchName', value: '' }])
const rowSelection = ref({})
const sorting = ref([
  { id: 'branchName', desc: false },
  { id: 'createDate', desc: false }
])

const isRowsSelected = computed(() => Object.keys(selectedRows.value).length)

function clearRowsSelection() {
  selectedRows.value = {}
  tableRef.value?.tableApi.toggleAllRowsSelected(false)
}

function toggleBackupModal(row?: Report) {
  modal.backup = !modal.backup
  backupModel.value = row
}

function toggleDeleteModal(row?: Report) {
  modal.delete = !modal.delete
  deleteModel.value = row
}

function toggleBackupSelected(clearSelection = false) {
  modal.bulkBackup = !modal.bulkBackup

  if (clearSelection) {
    clearRowsSelection()
  }
}

function toggleDeleteSelected(clearSelection = false) {
  modal.bulkDelete = !modal.bulkDelete

  if (clearSelection) {
    clearRowsSelection()
  }
}

async function deleteReport() {
  try {
    loading.value = true

    await $fetch(`/api/${route.params.project}/action/delete`, {
      method: 'post',
      body: {
        folders: [deleteModel.value?.id],
        type: 'reports'
      }
    })

    setTimeout(async () => {
      await refreshReports()
      loading.value = false
      showSuccessMessage(t('notifications.report.delete', 1), deleteModel.value?.id)
      toggleDeleteModal()
    }, DEFAULT_DELETE_TIMEOUT)
  } catch (error) {
    await refreshReports()
    loading.value = false
    toggleDeleteModal()
    showErrorMessage(error)
  }
}

async function deleteReports() {
  try {
    loading.value = true

    await $fetch(`/api/${route.params.project}/action/delete`, {
      method: 'post',
      body: {
        folders: Object.entries(selectedRows.value)
          .filter(([_, value]) => value)
          .map(([key]) => key),
        type: 'reports'
      }
    })

    setTimeout(async () => {
      await refreshReports()
      loading.value = false
      showSuccessMessage(t('notifications.report.delete', 2))
      toggleDeleteSelected(true)
    }, DEFAULT_DELETE_TIMEOUT)
  } catch (error) {
    await refreshReports()
    loading.value = false
    toggleDeleteSelected(true)
    showErrorMessage(error)
  }
}

async function backupReport() {
  try {
    loading.value = true

    await $fetch(`/api/${route.params.project}/action/backup`, {
      method: 'post',
      body: {
        folders: [backupModel.value?.id]
      }
    })

    setTimeout(() => {
      loading.value = false
      showSuccessMessage(t('notifications.report.backup', 1), backupModel.value?.id)
      toggleBackupModal()
    }, DEFAULT_DELETE_TIMEOUT)
  } catch (error) {
    loading.value = false
    toggleBackupModal()
    showErrorMessage(error)
  }
}

async function backupReports() {
  try {
    loading.value = true

    await $fetch(`/api/${route.params.project}/action/backup`, {
      method: 'post',
      body: {
        folders: Object.entries(selectedRows.value)
          .filter(([_, value]) => value)
          .map(([key]) => key)
      }
    })

    setTimeout(() => {
      loading.value = false
      showSuccessMessage(t('notifications.report.backup', 2))
      toggleBackupSelected(true)
    }, DEFAULT_DELETE_TIMEOUT)
  } catch (error) {
    loading.value = false
    toggleBackupSelected(true)
    showErrorMessage(error)
  }
}

function getReportDate(createDate: string) {
  const date = new Date(createDate)

  return h('div', { class: 'flex flex-col gap-1 text-muted' }, [
    h('span', {}, date.toLocaleDateString('uk')),
    h('span', {}, date.toLocaleTimeString('uk'))
  ])
}

function getSelectedReportInfo() {
  return Object.keys(selectedRows.value).map((key) => {
    const [env, branch, pipeline, timestamp] = key.split('_')

    const date = new Date(Number(timestamp))

    return {
      title: branch,
      description: `${env} / ${pipeline} / ${date.toLocaleDateString('uk')} / ${date.toLocaleTimeString('uk')}`
    }
  })
}

function getStatusBadge(status: string) {
  const color = {
    crashed: 'error' as const,
    error: 'error' as const,
    passed: 'success' as const,
    failed: 'warning' as const,
    pending: 'neutral' as const,
    unknown: 'error' as const
  }[status]

  return h(UBadge, { variant: 'subtle', color }, () => {
    return t(`reports.status.${status}`)
  })
}

function getResultContent(result: Report['result']) {
  const colorMap = {
    broken: 'text-error',
    count: 'text-info',
    passed: 'text-success',
    failed: 'text-warning'
  }

  const content = Object.entries(result)
    .filter(([label]) => label !== 'status' && label !== 'count')
    .sort((a, b) => a[0].localeCompare(b[0]))
    .reverse()
    .map(([label, value]) => {
      return h(
        'span',
        { class: value ? `${colorMap[label as keyof typeof colorMap]}` : 'text-muted' },
        `${t(`reports.result.${label}`)}: ${value}`
      )
    })

  return h('div', { class: 'flex gap-4 sm:grid sm:grid-flow-col sm:grid-rows-2 sm:gap-1' }, [
    h(
      'span',
      { class: result.count ? `${colorMap.count}` : 'text-muted' },
      result.count ? `${t(`reports.result.count`)}: ${result.count}` : ''
    ),
    ...content
  ])
}

const columns: TableColumn<Report>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'id': 'toggle-all-rows',
        'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => {
          table.toggleAllPageRowsSelected(!!value)
          if (value) {
            reports.value.forEach((item) => {
              selectedRows.value[item.id] = !!value
            })
          } else {
            if (Object.keys(selectedRows.value).length) {
              for (const key in selectedRows.value) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete selectedRows.value[key]
              }
            }
          }
        }
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        'id': row.original.id,
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => {
          row.toggleSelected(!!value)
          if (value) {
            selectedRows.value[row.original.id] = !!value
          } else if (selectedRows.value[row.original.id]) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete selectedRows.value[row.original.id]
          }
        }
      })
  },
  {
    id: 'branchName',
    accessorKey: 'branchName',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: t('reports.columns.branchName'),
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
      return h('span', { class: 'font-semibold' }, `${row.getValue('branchName')}`)
    }
  },
  {
    accessorKey: 'createDate',
    header: t('reports.columns.createDate'),
    cell: ({ row }) => getReportDate(row.getValue('createDate'))
  },
  {
    id: 'size_text',
    accessorKey: 'size.text',
    header: t('reports.columns.size'),
    cell: ({ row }) => row.getValue('size_text')
  },
  {
    id: 'result_status',
    accessorKey: 'result.status',
    header: t('reports.columns.status'),
    cell: ({ row }) => getStatusBadge(row.getValue('result_status'))
  },
  {
    accessorKey: 'result',
    header: t('reports.columns.result'),
    cell: ({ row }) => getResultContent(row.original.result)
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h('div', { class: 'flex gap-8 justify-between sm:justify-end' }, [
        h(UButton, {
          label: t('actions.open'),
          to: `/${route.params.project}/reports/${row.original.id}`
        }),
        h(UButton, {
          label: t('actions.backup'),
          variant: 'outline',
          color: 'secondary',
          onClick: () => toggleBackupModal(row.original)
        }),
        h(UButton, {
          label: t('actions.delete'),
          variant: 'outline',
          color: 'error',
          onClick: () => toggleDeleteModal(row.original)
        })
      ])
    }
  }
]
</script>

<template>
  <UiDashboardContent class="pb-24 h-full">
    <UPageGrid id="project-reports" class="h-full">
      <UPageCard
        class="col-span-3 h-full overflow-auto"
        :ui="{ header: 'w-full mb-0', container: 'lg:flex', wrapper: 'flex-0' }"
      >
        <template #header>
          <div class="w-full flex flex-wrap gap-2 justify-between">
            <UInput
              :model-value="tableRef?.tableApi?.getColumn('branchName')?.getFilterValue() as string"
              class="max-w-sm"
              :placeholder="t('global.filter')"
              @update:model-value="tableRef?.tableApi?.getColumn('branchName')?.setFilterValue($event)"
            />

            <div v-if="isRowsSelected" class="flex gap-2">
              <UButton color="secondary" variant="outline" @click="() => toggleBackupSelected()">
                {{ t('actions.backupSelected') }}
              </UButton>
              <UButton color="error" variant="outline" @click="() => toggleDeleteSelected()">
                {{ t('actions.deleteSelected') }}
              </UButton>
            </div>
          </div>
        </template>
        <UTable
          ref="tableRef"
          v-model:column-filters="columnFilters"
          v-model:row-selection="rowSelection"
          v-model:sorting="sorting"
          :sorting-options="{ enableMultiSort: true }"
          class="border-t border-accented"
          :columns="columns"
          :data="reports"
          :ui="{
            th: 'hidden first:table-cell nth-2:table-cell nth-2:col-span-3 lg:table-cell',
            tr: 'grid grid-cols-[33px_repeat(3,minmax(0,1fr))] sm:items-center lg:table-row',
            td: 'nth-2:col-span-2 nth-2:whitespace-pre-wrap nth-3:text-right lg:nth-3:text-left nth-4:col-start-2 nth-4:col-span-2 sm:nth-4:col-start-2 sm:nth-4:col-span-1 nth-5:col-start-2 nth-5:col-span-3 sm:nth-5:col-start-3 sm:nth-5:col-span-2'
          }"
          sticky
        />
      </UPageCard>
    </UPageGrid>

    <UModal
      v-model:open="modal.delete"
      :title="t('modal.delete.title', 1)"
      :description="t('modal.delete.description', 1)"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <UPageCard :ui="{ container: 'p-2 sm:p-4' }">
          <template v-for="(value, key) in deleteModel" :key="key">
            <div :class="['flex items-center', { hidden: key === 'id' }]">
              <span class="w-1/3">{{ t(`reports.columns.${key}`) }}:&nbsp;</span>
              <component :is="getReportDate(value as string)" v-if="key === 'createDate'" />
              <component
                :is="getResultContent(value as Report['result'])"
                v-else-if="key === 'result'"
                class="text-sm sm:flex-row sm:gap-2"
              />
              <span v-else-if="key === 'size'" class="font-bold">{{ (value as FormatedBytes).text }}</span>
              <span v-else class="font-bold">{{ value }}</span>
            </div>
          </template>
        </UPageCard>
      </template>
      <template #footer>
        <UButton color="error" :label="t('actions.delete')" :loading="loading" @click="deleteReport" />
        <UButton color="neutral" variant="outline" :label="t('actions.cancel')" @click="() => toggleDeleteModal()" />
      </template>
    </UModal>
    <UModal
      v-model:open="modal.bulkDelete"
      :title="t('modal.delete.title', 2)"
      :description="t('modal.delete.description', 2)"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <UScrollArea v-slot="{ item, index }" :items="getSelectedReportInfo()" class="w-full max-h-64">
          <UPageCard
            v-bind="item as object"
            :variant="index % 2 === 0 ? 'soft' : 'outline'"
            class="rounded-none"
            :ui="{ container: 'p-2 sm:p-2' }"
          />
        </UScrollArea>
      </template>
      <template #footer>
        <UButton color="error" :label="t('actions.delete')" :loading="loading" @click="deleteReports" />
        <UButton color="neutral" variant="outline" :label="t('actions.cancel')" @click="() => toggleDeleteSelected()" />
      </template>
    </UModal>
    <UModal
      v-model:open="modal.backup"
      :title="t('modal.backup.title', 1)"
      :description="t('modal.backup.description', 1)"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <UPageCard :ui="{ container: 'p-2 sm:p-4' }">
          <template v-for="(value, key) in backupModel" :key="key">
            <div :class="['flex items-center', { hidden: key === 'id' }]">
              <span class="w-1/3">{{ t(`reports.columns.${key}`) }}:&nbsp;</span>
              <component :is="getReportDate(value as string)" v-if="key === 'createDate'" />
              <component
                :is="getResultContent(value as Report['result'])"
                v-else-if="key === 'result'"
                class="text-sm sm:flex-row sm:gap-2"
              />
              <span v-else-if="key === 'size'" class="font-bold">{{ (value as FormatedBytes).text }}</span>
              <span v-else class="font-bold">{{ value }}</span>
            </div>
          </template>
        </UPageCard>
      </template>
      <template #footer>
        <UButton color="primary" :label="t('actions.backup')" :loading="loading" @click="backupReport" />
        <UButton color="neutral" variant="outline" :label="t('actions.cancel')" @click="() => toggleBackupModal()" />
      </template>
    </UModal>
    <UModal
      v-model:open="modal.bulkBackup"
      :title="t('modal.backup.title', 2)"
      :description="t('modal.backup.description', 2)"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <UScrollArea v-slot="{ item, index }" :items="getSelectedReportInfo()" class="w-full max-h-64">
          <UPageCard
            v-bind="item as object"
            :variant="index % 2 === 0 ? 'soft' : 'outline'"
            class="rounded-none"
            :ui="{ container: 'p-1 sm:p-1' }"
          />
        </UScrollArea>
      </template>
      <template #footer>
        <UButton color="primary" :label="t('actions.backup')" :loading="loading" @click="backupReports" />
        <UButton color="neutral" variant="outline" :label="t('actions.cancel')" @click="() => toggleBackupSelected()" />
      </template>
    </UModal>
  </UiDashboardContent>
</template>
