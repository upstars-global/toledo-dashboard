import type { BackupRequestBody, DeleteRequestBody, ReferenceRequestBody, StartTestRequestBody } from '~~/shared/types'
import { DEFAULT_TIMEOUT } from '~~/shared/constants'

export const useActions = () => {
  const { t } = useI18n()
  const { currentRoute } = useRouter()
  const { showErrorMessage, showSuccessMessage } = useNotifications()
  const { refreshJobsStatus } = useJobsStore()
  const { refreshReports } = useReportsStore()

  async function backupReports(body: BackupRequestBody) {
    try {
      await $fetch(`/api/${currentRoute.value.params.project}/action/backup`, { method: 'post', body })

      setTimeout(() => {
        if (body.folders.length > 1) {
          showSuccessMessage(t('notifications.report.backup', 2))
        } else {
          showSuccessMessage(t('notifications.report.backup', 1), body.folders[0])
        }
      })
    } catch (error) {
      showErrorMessage(error)
    }
  }

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

  async function deleteReports(body: DeleteRequestBody) {
    try {
      await $fetch(`/api/${currentRoute.value.params.project}/action/delete`, { method: 'post', body })

      setTimeout(() => {
        if (body.folders.length > 1) {
          showSuccessMessage(t('notifications.report.delete', 2))
        } else {
          showSuccessMessage(t('notifications.report.delete', 1), body.folders[0])
        }
      }, DEFAULT_TIMEOUT)
    } catch (error) {
      showErrorMessage(error)
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

  return { backupReports, createReferences, deleteReports, startTest }
}
