import type { Settings } from '~~/shared/types'

export const useSettingsStore = defineStore('settings', () => {
  const route = useRoute()
  const { showErrorMessage } = useNotifications()

  const { data: settingsData, error: settingsError } = useFetch<Settings | null>(
    () => `/api/${route.params.project}/settings`
  )

  const globalMismatchThreshold = computed(() => {
    return settingsData.value?.misMatchThreshold ?? 0
  })

  onMounted(() => {
    if (settingsError.value) {
      showErrorMessage(settingsError.value)
    }
  })

  return {
    globalMismatchThreshold
  }
})
