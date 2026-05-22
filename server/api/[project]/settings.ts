import type { Settings } from '~~/shared/types'
import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async (event) => {
  try {
    const projectId = getRouterParam(event, 'project')

    if (!projectId || projectId === 'undefined') {
      throwError('projectId is not defined', 'GET_PROJECT_ERROR')
      return null
    }

    return await $fetch<Settings>(`/_${projectId}/api/settings`)
  } catch (error) {
    throwError(error, 'GET_PROJECT_SETTINGS_ERROR')
    return []
  }
})
