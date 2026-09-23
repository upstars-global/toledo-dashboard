import type { BackstopReport } from '~~/shared/types'
import { formatBytes } from '~~/server/helpers/formatBytes'
import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async (event): Promise<BackstopReport> => {
  try {
    const projectId = getRouterParam(event, 'project')

    if (!projectId || projectId === 'undefined') {
      return throwError('projectId is not defined', 'GET_PROJECT_ERROR')
    }

    const queries = getQuery<Record<string, string>>(event)
    const params = new URLSearchParams(queries)

    const report = await $fetch<BackstopReport<number>>(`/_${projectId}/api/report?${params}`)

    return {
      ...report,
      size: formatBytes(report.size)
    }
  } catch (error) {
    return throwError(error, 'GET_PROJECT_REPORT_ERROR')
  }
})
