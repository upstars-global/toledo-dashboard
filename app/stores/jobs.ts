import type { JobStatus } from '~~/shared/types'

export const useJobsStore = defineStore('jobs', () => {
  const { currentRoute } = useRouter()
  const { showErrorMessage } = useNotifications()

  const {
    data: jobsStatus,
    error: jobsStatusError,
    refresh: refreshJobsStatus
  } = useFetch<JobStatus[]>(() => `/api/${currentRoute.value.params.project}/jobs-status`, {
    default: () => []
  })

  const isReferenceJobRunning = computed(() => {
    return jobsStatus.value.some((job) => job.name === 'reference' && job.state === 'active')
  })

  onMounted(() => {
    if (jobsStatusError.value) {
      showErrorMessage(jobsStatusError.value)
    }
  })

  return {
    isReferenceJobRunning,
    jobsStatus,
    refreshJobsStatus
  }
})
