import type { ReferenceRequestBody, StartTestRequestBody } from '~~/shared/types'

export const useActions = () => {
  const { currentRoute } = useRouter()
  const { showErrorMessage } = useNotifications()
  const { refreshJobsStatus } = useJobsStore()
  const { refreshReports } = useReportsStore()

  async function createReferences(body: ReferenceRequestBody) {
    try {
      await $fetch(`/api/${currentRoute.value.params.project}/action/reference`, { method: 'post', body })

      await refreshJobsStatus()
      await refreshReports()
    } catch (error) {
      showErrorMessage(error)

      await refreshJobsStatus()
      await refreshReports()
    }
  }

  async function startTest(body: StartTestRequestBody) {
    try {
      await $fetch(`/api/${currentRoute.value.params.project}/action/start`, { method: 'post', body })

      await refreshJobsStatus()
      await refreshReports()
    } catch (error) {
      showErrorMessage(error)

      await refreshJobsStatus()
      await refreshReports()
    }
  }

  return { createReferences, startTest }
}
