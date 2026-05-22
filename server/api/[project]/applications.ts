import type { Application, ServerCommonResponse } from '~~/shared/types'
import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async (event): Promise<Application[] | ServerCommonResponse> => {
  try {
    const projectId = getRouterParam(event, 'project')

    if (!projectId || projectId === 'undefined') {
      return throwError('projectId is not defined', 'GET_PROJECT_ERROR')
    }

    return await $fetch<Application[]>(`/_${projectId}/api/applications`)
  } catch (error) {
    return throwError(error, 'GET_PROJECT_ENVS_ERROR')
  }
})
