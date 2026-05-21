import type { Application } from '~~/shared/types'

export const useApplicationsStore = defineStore('applications', () => {
  const { currentRoute } = useRouter()
  const { showErrorMessage } = useNotifications()

  const {
    data: applications,
    error,
    refresh: refreshApps
  } = useFetch<Application[]>(() => `/api/${currentRoute.value.params.project}/applications`, {
    default: () => []
  })

  const dynamicAppsList = computed(() => {
    return applications.value.filter((app) => app.isDynamic)
  })

  const persistentAppsList = computed(() => {
    return applications.value.filter((app) => !app.isDynamic)
  })

  onMounted(() => {
    if (error.value) {
      showErrorMessage(error.value)
    }
  })

  return {
    applications,
    dynamicAppsList,
    persistentAppsList,
    refreshApps
  }
})
