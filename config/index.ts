import type { ProjectConfig } from '~~/shared/types'
import type { NitroRouteConfig } from 'nitropack/types'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const ENDPOINTS = ['api/**']
const PROJECTS_LIST: ProjectConfig[] = [
  {
    id: 'bond',
    apiUrl: 'https://toledo-bond-staging.wlabel.site',
    label: 'Bond',
    icon: 'i-lucide-coins',
    mockUrl: 'https://mock-bond.staging.wlabel.site',
    socketUrl: 'toledo-bond-staging.wlabel.site/ws/jobs'
  },
  {
    id: 'felix',
    apiUrl: 'https://toledo-felix-staging.wlabel.site',
    label: 'Felix',
    icon: 'i-lucide-cat',
    mockUrl: 'https://mock-felix.staging.wlabel.site',
    socketUrl: 'toledo-felix-staging.wlabel.site/ws/jobs'
  },
  {
    id: 'thor',
    apiUrl: 'https://toledo-thor-staging.wlabel.site',
    label: 'Thor',
    icon: 'i-lucide-gavel',
    mockUrl: 'https://mock-thor.staging.wlabel.site',
    socketUrl: 'toledo-thor-staging.wlabel.site/ws/jobs'
  },
  {
    id: 'vegas',
    apiUrl: 'https://toledo-vegas-staging.wlabel.site',
    label: 'Vegas',
    icon: 'i-lucide-dices',
    mockUrl: 'https://mock-vegas.staging.wlabel.site',
    socketUrl: 'toledo-vegas-staging.wlabel.site/ws/jobs'
  }
]

export const getProjectList = () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      const rawConfig = readFileSync(resolve('env.json'), 'utf8')

      if (!rawConfig.trim()) {
        console.error('env.json is empty')
        return []
      }

      return JSON.parse(rawConfig) as ProjectConfig[]
    } catch (error) {
      console.error(error)
      return []
    }
  }

  return PROJECTS_LIST
}

export const getNitroRouteRules = () => {
  const config = getProjectList()

  const routes = config.reduce(
    (acc, project) => {
      ENDPOINTS.forEach((endpoint) => {
        const path = `/_${project.id}/${endpoint}`
        acc[path] = {
          proxy: {
            to: `${project.apiUrl}/${endpoint}`
          }
        }
      })

      return acc
    },
    {} as Record<string, NitroRouteConfig>
  )

  return routes
}
