import type { DiskSpace, FormatedBytes } from '~~/shared/types'
import { formatBytes } from '~~/server/helpers/formatBytes'
import { throwError } from '~~/server/helpers/throwError'

export default defineEventHandler(async (event): Promise<DiskSpace<FormatedBytes> | null> => {
  try {
    const projectId = getRouterParam(event, 'project')

    if (!projectId || projectId === 'undefined') {
      throwError('projectId is not defined', 'GET_PROJECT_ERROR')
      return null
    }

    const { capacity, folders, used } = await $fetch<DiskSpace<number>>(`/_${projectId}/api/disk-space`)

    return {
      capacity: formatBytes(capacity),
      folders: {
        backups: formatBytes(folders.backups),
        references: formatBytes(folders.references),
        reports: formatBytes(folders.reports),
        scenarios: formatBytes(folders.scenarios)
      },
      used: formatBytes(used)
    }
  } catch (error) {
    throwError(error, 'GET_PROJECT_DISK_SPACE_ERROR')
    return null
  }
})
