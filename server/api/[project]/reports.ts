import type { Report } from '~~/shared/types'
import { formatBytes } from '~~/server/helpers/formatBytes'
import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async (event): Promise<Report[]> => {
  try {
    const projectId = getRouterParam(event, 'project')

    if (!projectId || projectId === 'undefined') {
      return throwError('projectId is not defined', 'GET_PROJECT_ERROR')
    }

    const reports = await $fetch<Report<number>[]>(`/_${projectId}/api/reports`)

    return reports.map((report) => {
      return {
        ...report,
        size: formatBytes(report.size)
      }
    })
  } catch (error) {
    return throwError(error, 'GET_PROJECT_REPORTS_ERROR')
  }
})
