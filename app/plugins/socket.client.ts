import type { Emitter } from 'mitt'
import type { ApplicationEvents, JobStatusMessage } from '~~/shared/types'

export default defineNuxtPlugin((nuxtApp) => {
  const $bus = nuxtApp.$bus as Emitter<ApplicationEvents>
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const { userId } = useCurrentUser()
  const configStore = useConfigStore()

  configStore.projectsList.forEach((project) => {
    const socket = new WebSocket(`${protocol}//${project.socketUrl}`)

    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({ type: 'subscribe', userId: userId.value }))

      console.log(`${project.label} WebSocket connected`)
    })

    socket.addEventListener('message', async (event) => {
      const message: JobStatusMessage = JSON.parse(event.data)

      if (message.type === 'job-status') {
        if (message.command === 'reference') {
          $bus.emit(`${project.id}:job:reference`, { label: project.label, message })
        }

        if (message.command === 'test') {
          $bus.emit(`${project.id}:job:test`, { label: project.label, message })
        }
      }
    })

    socket.addEventListener('close', () => {
      console.log(`${project.label} WebSocket closed`)
    })
  })
})
