import type { Report } from '~~/shared/types'

export const useReportsStore = defineStore('reports', () => {
  const route = useRoute()
  const { showErrorMessage } = useNotifications()

  const {
    data: reports,
    error,
    refresh: refreshReports
  } = useFetch<Report[]>(() => `/api/${route.params.project}/reports`, {
    default: () => []
  })

  onMounted(() => {
    if (error.value) {
      showErrorMessage(error.value)
    }
  })

  return {
    reports,
    refreshReports
  }
})
