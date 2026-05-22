import type { JobStatus } from '~~/shared/types'
import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async (event) => {
  try {
    const projectId = getRouterParam(event, 'project')

    if (!projectId || projectId === 'undefined') {
      return throwError('projectId is not defined', 'GET_PROJECT_ERROR')
    }

    return await $fetch<JobStatus[]>(`/_${projectId}/api/jobs-status`)
  } catch (error) {
    return throwError(error, 'GET_PROJECT_JOBS_STATUS_ERROR')
  }
})
