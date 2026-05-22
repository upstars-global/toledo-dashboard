import type { ReferenceRequestBody } from '~~/shared/types'
import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async (event) => {
  try {
    const projectId = getRouterParam(event, 'project')
    if (!projectId || projectId === 'undefined') {
      throwError('projectId is not defined', 'GET_PROJECT_ERROR')
      return
    }

    const body = await readBody<ReferenceRequestBody>(event)

    return await $fetch(`/_${projectId}/api/action/reference`, {
      method: 'post',
      body: JSON.stringify(body)
    })
  } catch (error) {
    return throwError(error, 'CREATE_REFERENCE_ERROR')
  }
})
