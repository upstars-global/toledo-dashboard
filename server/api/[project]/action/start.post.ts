import type { StartTestRequestBody } from '~~/shared/types'
import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async (event): Promise<void> => {
  try {
    const projectId = getRouterParam(event, 'project')

    if (!projectId || projectId === 'undefined') {
      throwError('projectId is not defined', 'GET_PROJECT_ERROR')
      return
    }

    const body = await readBody<StartTestRequestBody>(event)

    return await $fetch(`/_${projectId}/api/action/start`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
  } catch (error) {
    throwError(error, 'START_TEST_ERROR')
    return
  }
})
