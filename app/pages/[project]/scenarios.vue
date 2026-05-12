<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { Scenario, SelectedApp } from '~~/shared/types'
import type { TableColumn, CommandPaletteGroup } from '@nuxt/ui'

type SelectedRows = Record<string, boolean | undefined>

definePageMeta({
  middleware: 'auth'
})

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const ULink = resolveComponent('ULink')
const UCheckbox = resolveComponent('UCheckbox')

const { t } = useI18n()
const { ui } = useAppConfig()
const route = useRoute()
const { createReferences, startTest } = useActions()
const { showErrorMessage } = useNotifications()
const { dynamicAppsList, persistentAppsList } = storeToRefs(useApplicationsStore())
const { refreshApps } = useApplicationsStore()
const { mockUrl } = storeToRefs(useConfigStore())
const { globalMismatchThreshold } = storeToRefs(useSettingsStore())
const { userId, userName } = useCurrentUser()
const { isReferenceJobRunning } = storeToRefs(useJobsStore())

const { data: scenariosData, error: scenariosError } = await useFetch<Scenario[]>(
  `/api/${route.params.project}/scenarios`,
  { default: () => [] }
)

if (scenariosError.value) {
  showErrorMessage(scenariosError.value)
}

const modal = reactive({
  startTest: false,
  createReference: false
})
const searchQuery = ref('')
const selectedRows = ref<SelectedRows>({})
const selectedApp = ref<SelectedApp | null>(null)
const misMatchThreshold = ref(globalMismatchThreshold.value)
const tableRef = useTemplateRef('tableRef')
const columnFilters = ref([{ id: 'label', value: '' }])
const rowSelection = ref({})
const sorting = ref([{ id: 'label', desc: false }])
const filteredRowsCount = ref(0)

const isRowsSelected = computed(() => Object.keys(selectedRows.value).length)
const items = computed(() => {
  return scenariosData.value.map((scenario) => ({
    label: scenario.label,
    url: scenario.url
  }))
})

function clearRowsSelection() {
  selectedRows.value = {}
  tableRef.value?.tableApi.toggleAllRowsSelected(false)
}

function toggleStartTestModal(clearSelection = false) {
  modal.startTest = !modal.startTest
  selectedApp.value = null

  if (clearSelection) {
    clearRowsSelection()
  }
}

function toggleCreateReferenceModal(clearSelection = false) {
  modal.createReference = !modal.createReference

  if (clearSelection) {
    clearRowsSelection()
  }
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

async function handleCreateReferences() {
  await createReferences({
    scenarios: Object.entries(selectedRows.value)
      .filter(([_, value]) => value)
      .map(([key]) => key),
    userName: userName.value,
    userId: userId.value
  })
  toggleCreateReferenceModal(true)
}

async function handleStartTest() {
  await startTest({
    application: selectedApp.value?.app,
    misMatchThreshold: misMatchThreshold.value,
    scenarios: Object.entries(selectedRows.value)
      .filter(([_, value]) => value)
      .map(([key]) => key),
    userName: userName.value,
    userId: userId.value
  })
  toggleStartTestModal(true)
}

function handleFilterChange(query: string) {
  tableRef.value?.tableApi?.getColumn('label')?.setFilterValue(query)

  const filteredRows = tableRef.value?.tableApi?.getFilteredRowModel().rows
  filteredRowsCount.value = filteredRows?.length || 0
}

const columns: TableColumn<Scenario>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => {
          table.toggleAllPageRowsSelected(!!value)

          if (value) {
            scenariosData.value.forEach((item) => {
              if (item.label) {
                selectedRows.value[item.label] = !!value
              }
            })
          } else {
            if (isRowsSelected.value) {
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
        'modelValue': row.getIsSelected(),
        'onUpdate:modelValue': (value: boolean | 'indeterminate') => {
          row.toggleSelected(!!value)
          if (value && row.original.label) {
            selectedRows.value[row.original.label] = !!value
          } else if (row.original.label && selectedRows.value[row.original.label]) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete selectedRows.value[row.original.label]
          }
        }
      })
  },
  {
    accessorKey: 'label',
    header: ({ column }) => {
      const isSorted = column.getIsSorted()

      return h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label: t('scenarios.columns.name'),
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
      const url = row.original.url?.charAt(0) === '/' ? row.original.url.slice(1) : row.original.url

      return h(
        ULink,
        {
          class: 'font-semibold',
          href: `${mockUrl.value}/${url}`,
          external: true,
          target: '_blank'
        },
        () => row.getValue('label')
      )
    }
  },
  {
    id: 'actions',
    cell: ({ table, row }) => {
      return h('div', { class: 'flex gap-8 justify-between sm:justify-end' }, [
        h(UButton, {
          label: t('actions.startTest'),
          variant: 'outline',
          color: 'secondary',
          disabled: isReferenceJobRunning.value,
          onClick: () => {
            table.toggleAllRowsSelected(false)
            if (isRowsSelected.value) {
              for (const key in selectedRows.value) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete selectedRows.value[key]
              }
            }

            setTimeout(() => {
              selectedRows.value[row.original.label] = true

              toggleStartTestModal()
              row.toggleSelected(true)
            }, 100)
          }
        })
      ])
    }
  }
]
</script>

<template>
  <UiDashboardContent class="pb-24 h-full gap-2 lg:gap-4">
    <UPageGrid id="scenarios" class="h-full">
      <UPageCard
        class="col-span-3 h-full overflow-auto"
        :ui="{ header: 'w-full mb-0', container: 'lg:flex', wrapper: 'flex-0' }"
      >
        <template #header>
          <div class="w-full flex flex-wrap gap-2 mb-2">
            <UBadge color="neutral" variant="subtle" :label="t('scenarios.total', { count: scenariosData.length })" />
            <UBadge color="secondary" variant="subtle" :label="t('scenarios.filtered', { count: filteredRowsCount })" />
            <UBadge
              color="secondary"
              variant="subtle"
              :label="t('scenarios.selected', { count: Object.keys(selectedRows).length })"
            />
          </div>
          <div class="w-full flex flex-wrap gap-2 justify-between">
            <div class="max-w-sm flex gap-2 items-center">
              <UInput
                :model-value="tableRef?.tableApi?.getColumn('label')?.getFilterValue() as string"
                class="max-w-sm"
                :placeholder="t('global.filter')"
                @update:model-value="handleFilterChange"
              />
            </div>

            <div v-if="isRowsSelected" class="flex gap-2">
              <UButton :disabled="isReferenceJobRunning" @click="() => toggleStartTestModal()">
                {{ t('actions.startSelectedTest', Object.keys(selectedRows).length) }}
              </UButton>
              <UButton :disabled="isReferenceJobRunning" @click="() => toggleCreateReferenceModal()">
                {{ t('actions.createSelectedReference', Object.keys(selectedRows).length) }}
              </UButton>
            </div>
          </div>
        </template>
        <UTable
          ref="tableRef"
          v-model:column-filters="columnFilters"
          v-model:row-selection="rowSelection"
          v-model:sorting="sorting"
          class="border-t border-accented"
          :columns="columns"
          :data="items"
          :ui="{
            tr: 'grid grid-cols-[33px_repeat(2,minmax(0,1fr))] sm:table-row',
            td: 'nth-2:whitespace-pre-wrap nth-2:col-span-2 nth-3:col-start-2'
          }"
          sticky
        />
      </UPageCard>
    </UPageGrid>
    <UModal
      v-model:open="modal.startTest"
      :title="t('modal.startSelectedTest.title', Object.keys(selectedRows).length)"
      :description="t('modal.startSelectedTest.description')"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <UFormField :label="t('modal.startSelectedTest.misMatchThreshold')">
          <UInputNumber
            v-model="misMatchThreshold"
            class="w-full"
            :min="0"
            :max="100"
            :step="0.01"
            :placeholder="t('modal.startSelectedTest.misMatchThresholdPlaceholder')"
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
        <UButton
          color="primary"
          :label="t(`actions.startSelectedTest`, Object.keys(selectedRows).length)"
          @click="handleStartTest"
        />
        <UButton color="neutral" variant="outline" :label="t('actions.cancel')" @click="() => toggleStartTestModal()" />
      </template>
    </UModal>
    <UModal
      v-model:open="modal.createReference"
      :title="t('modal.createReference.title', Object.keys(selectedRows).length)"
      :description="t('modal.createReference.description', Object.keys(selectedRows).length)"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <UScrollArea
          v-slot="{ item, index }"
          :items="Object.keys(selectedRows).map((key) => ({ description: key }))"
          class="w-full max-h-64"
        >
          <UPageCard
            v-bind="item as object"
            :variant="index % 2 === 0 ? 'soft' : 'outline'"
            class="rounded-none"
            :ui="{ container: 'p-1 sm:p-1' }"
          />
        </UScrollArea>
      </template>
      <template #footer>
        <UButton
          color="primary"
          :label="t(`actions.createReference`, Object.keys(selectedRows).length)"
          @click="handleCreateReferences"
        />
        <UButton
          color="neutral"
          variant="outline"
          :label="t('actions.cancel')"
          @click="() => toggleCreateReferenceModal()"
        />
      </template>
    </UModal>
  </UiDashboardContent>
</template>
