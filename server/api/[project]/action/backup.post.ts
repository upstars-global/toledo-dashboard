import type { BackupRequestBody } from '~~/shared/types'
import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async (event) => {
  try {
    const projectId = getRouterParam(event, 'project')

    if (!projectId) {
      throwError('projectId is not defined', 'GET_PROJECT_ERROR')
      return
    }

    const body = await readBody<BackupRequestBody>(event)

    return await $fetch(`/_${projectId}/api/action/backup`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  } catch (error) {
    throwError(error, 'BACKUP_TEST_ERROR')
    return
  }
})
