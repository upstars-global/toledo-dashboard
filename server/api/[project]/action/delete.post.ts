import type { DeleteRequestBody } from '~~/shared/types'
import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async (event) => {
  try {
    const projectId = getRouterParam(event, 'project')

    if (!projectId || projectId === 'undefined') {
      throwError('projectId is not defined', 'GET_PROJECT_ERROR')
      return
    }

    const body = await readBody<DeleteRequestBody>(event)

    return await $fetch(`/_${projectId}/api/action/delete`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  } catch (error) {
    throwError(error, 'DELETE_TEST_ERROR')
    return
  }
})
