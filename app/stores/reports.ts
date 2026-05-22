import type { Report } from '~~/shared/types'

export const useReportsStore = defineStore('reports', () => {
  const { currentRoute } = useRouter()
  const { showErrorMessage } = useNotifications()

  const {
    data: reports,
    error,
    refresh: refreshReports
  } = useFetch<Report[]>(() => `/api/${currentRoute.value.params.project}/reports`, {
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
