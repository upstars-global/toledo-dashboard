import type { BackstopImageId, BackstopTestStatus } from '~~/shared/types'

type FilterStatus = BackstopTestStatus | 'all'
type Settings = {
  [key in BackstopImageId]: boolean
} & {
  textInfo: boolean
}

const STORAGE_KEY = 'ls:backstopjs'

export const useReportStore = defineStore('report', () => {
  // filter
  const filterQuery = ref('')
  const filteredCount = ref(0)
  const filterStatus = ref<FilterStatus>('all')

  // settings
  const settings = ref<Settings>({
    textInfo: false,
    refImage: true,
    testImage: true,
    diffImage: true
  })
  const settingOnlyText = computed(
    () => !settings.value.refImage && !settings.value.testImage && !settings.value.diffImage
  )
  const settingsAllImagesHidden = computed(() => settingOnlyText.value)

  function setFilterStatus(status: FilterStatus) {
    filterStatus.value = status
  }

  function setFilteredCount(count: number) {
    filteredCount.value = count
  }

  function setSettingsAllImages(visible: boolean) {
    settings.value.refImage = visible
    settings.value.testImage = visible
    settings.value.diffImage = visible
  }

  function settingsRestore() {
    if (import.meta.server) {
      return
    }

    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return
    }

    try {
      const parsed = JSON.parse(raw)
      Object.assign(settings.value, parsed?.layoutSettings ?? {})
    } catch (error) {
      console.error(error)
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  function settingsPersist() {
    if (import.meta.server) {
      return
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ layoutSettings: settings.value }))
  }

  return {
    filterQuery,
    filteredCount,
    filterStatus,
    settings,
    settingOnlyText,
    settingsAllImagesHidden,
    setFilterStatus,
    setFilteredCount,
    setSettingsAllImages,
    settingsRestore,
    settingsPersist,
  }
})
