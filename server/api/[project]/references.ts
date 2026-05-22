import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async (event) => {
  try {
    const projectId = getRouterParam(event, 'project')

    if (!projectId || projectId === 'undefined') {
      throwError('projectId is not defined', 'GET_PROJECT_ERROR')
      return null
    }

    return await $fetch<string[]>(`/_${projectId}/api/references`)
  } catch (error) {
    throwError(error, 'GET_REFERENCE_LIST_ERROR')
    return null
  }
})
