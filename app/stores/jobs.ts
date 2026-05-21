import type { JobStatus } from '~~/shared/types'

export const useJobsStore = defineStore('jobs', () => {
  const route = useRoute()
  const { showErrorMessage } = useNotifications()

  const {
    data: jobsStatus,
    error: jobsStatusError,
    refresh: refreshJobsStatus
  } = useFetch<JobStatus[]>(() => `/api/${route.params.project}/jobs-status`, {
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
